// Copyright 2016-2022, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as cdn from "@pulumi/azure-native/cdn";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as mime from "mime";
import * as path from "path";
import * as fs from "fs";
import { AuthorizationRule } from "@pulumi/aws/ec2clientvpn";

export interface WebsiteArgs {
    sitePath: string;
    indexHTML: string;
    error404: string;
    withCDN: boolean;
    priceClass: string;
    targetDomain: string;
    certificateARN?: string;
    cacheTTL?: number;
    withLogs?: boolean;
}

/**
 *  A Pulumi component that provisions an S3 static website with an optional CloudFront CDN.
*/
export class Website extends pulumi.ComponentResource {
    private staticWebsite?: storage.StorageAccountStaticWebsite;
    private args: WebsiteArgs;
    private resourceOptions: pulumi.CustomResourceOptions;

    bucketName?: pulumi.Output<string>;
    bucketWebsiteURL?: pulumi.Output<string>;
    websiteURL?: pulumi.Output<string>;
    websiteLogsBucketName?: pulumi.Output<string>;
    cdnDomainName?: pulumi.Output<string>;
    cdnURL?: pulumi.Output<string>;

    private storageAccount: storage.StorageAccount;
    private resourceGroup: resources.ResourceGroup;

    constructor (name: string, args: WebsiteArgs, opts?: pulumi.CustomResourceOptions) {
        super("pulumi-aws-static-website:azure:Website", name, args, opts);
        this.args = args;

        this.resourceOptions = {
            parent: this,
        };

        if (!args.indexHTML) {
            // Defaults to index.html if not specified.
            args.indexHTML = "index.html";
        }

        // Check the sitePath directory exists.
        if (!fs.existsSync(args.sitePath)) {
            pulumi.log.error(`Site path directory, ${args.sitePath} does not exist.`);
        }

        // Check the default document exists.
        if (!fs.existsSync(path.join(args.sitePath, args.indexHTML))) {
            pulumi.log.error(`Default document "${args.indexHTML}" does not exist.`);
        }

        // Check the error document exists if specified.
        if (args.error404 && !fs.existsSync(path.join(args.sitePath, args.error404))) {
            pulumi.log.warn(`Default document "${args.error404}" does not exist.`);
        }

        this.resourceGroup = new resources.ResourceGroup("resourceGroup");

        this.storageAccount = new storage.StorageAccount("storageaccount", {
            enableHttpsTrafficOnly: true,
            kind: storage.Kind.StorageV2,
            resourceGroupName: this.resourceGroup.name,
            sku: {
                name: storage.SkuName.Standard_LRS,
            },
        });
        

        // Provision content bucket.
        this.staticWebsite = this.provisionStaticSite();
        this.bucketName = this.storageAccount.name;
        this.bucketWebsiteURL = pulumi.interpolate`http://${this.storageAccount.primaryEndpoints.web}`;
        this.websiteURL = pulumi.interpolate`http://${this.storageAccount.primaryEndpoints.web}`;
        // // Provision logs bucket if specified in config.
        // if (this.args.withLogs) {
        //     this.logsBucket = this.provisionLogsBucket();
        //     this.websiteLogsBucketName = this.logsBucket.bucketDomainName;
        // }

        // // If the user specified withCDN, provision CloudFront distribution.
        // if (this.bucket && this.args.withCDN) {
        //     const cdn = this.provisionCDN();
        //     this.cdnDomainName = cdn.domainName;
        //     this.cdnURL = pulumi.interpolate`https://${cdn.domainName}`;
        //     if (this.args.targetDomain) {
        //         this.websiteURL = pulumi.interpolate`https://${this.args.targetDomain}`;
        //     } else {
        //         this.websiteURL = pulumi.interpolate`https://${cdn.domainName}`;
        //     }

        // }

        this.registerOutputs({
            bucketName: this.bucketName,
            bucketWebsiteURL: this.bucketWebsiteURL,
            // cdnDomainName: this.cdnDomainName,
            // cdnURL: this.cdnURL,
            websiteURL: this.args.withCDN ? this.websiteURL : this.bucketWebsiteURL,
            // logsBucketName: this.logsBucket?.bucketDomainName,
        });
    }

    // Provision s3 bucket to contain the website contents.
    private provisionStaticSite () {
        // Enable static website support
        const contentBucket = new storage.StorageAccountStaticWebsite("staticWebsite", {
            accountName: this.storageAccount.name,
            resourceGroupName: this.resourceGroup.name,
            indexDocument: this.args.indexHTML,
            error404Document: this.args.error404,
        });

        
        const webContentsRootPath = path.join(process.cwd(), this.args.sitePath);
        this.putContents(contentBucket, webContentsRootPath);

        return contentBucket;
    }

    // Provision logs bucket for the CDN's request logs.
    private provisionLogsBucket (): aws.s3.Bucket {
        const bucketName = `${this.args.targetDomain || "website"}-logs`;
        return new aws.s3.Bucket(
            bucketName,
            {
                bucket: this.args.targetDomain ? bucketName : undefined,
                acl: "private",
                forceDestroy: true,
            },
            this.resourceOptions);
    }

    // Upload website content to s3 content bucket.
    private putContents (website: storage.StorageAccountStaticWebsite, rootDir: string) {
        function crawlDirectory (dir: string, f: (_: string) => void) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const filePath = `${dir}/${file}`;
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    crawlDirectory(filePath, f);
                }
                if (stat.isFile()) {
                    f(filePath);
                }
            }
        }

        pulumi.log.info(`Syncing contents from local disk at ${rootDir}.`);
        crawlDirectory(
            rootDir,
            (filePath: string) => {
                console.log(filePath)
                const relativeFilePath = filePath.replace(rootDir + "/", "");
                const contentFile = new storage.Blob(relativeFilePath, {
                    resourceGroupName: this.resourceGroup.name,
                    accountName: this.storageAccount.name,
                    containerName: website.containerName,
                    source: new pulumi.asset.FileAsset(filePath),
                    contentType: "text/html",
                })
            });
    }

    // Provision CloudFront CDN.
//     private provisionCDN (): aws.cloudfront.Distribution {
//         let cdn: aws.cloudfront.Distribution;
//         let certificate;

//         const distributionArgs = this.configureDistributionArgs();

//         // If no DNS info was provided, provision a CloudFront CDN with the default settings.
//         if (!this.args.targetDomain) {
//             distributionArgs.aliases = [];
//             distributionArgs.viewerCertificate = {
//                 cloudfrontDefaultCertificate: true,
//                 sslSupportMethod: "sni-only",
//             };
//             cdn = new aws.cloudfront.Distribution(
//                 "website-cdn",
//                 distributionArgs,
//                 this.resourceOptions
//             );
//             return cdn;
//         }

//         if (this.args.certificateARN) {
//             distributionArgs.viewerCertificate = {
//                 cloudfrontDefaultCertificate: false,
//                 acmCertificateArn: this.args.certificateARN,
//                 sslSupportMethod: "sni-only",
//             };
//         } else {
//             certificate = this.provisionAndValidateCert(this.bucket);
//             distributionArgs.viewerCertificate = {
//                 cloudfrontDefaultCertificate: false,
//                 acmCertificateArn: certificate.arn,
//                 sslSupportMethod: "sni-only",
//             };
//         }

//         const domainParts = getDomainAndSubdomain(this.args.targetDomain);
//         this.websiteURL = pulumi.interpolate`http://${this.args.targetDomain}`;

//         cdn = new aws.cloudfront.Distribution(
//             "website-cdn",
//             distributionArgs,
//             this.resourceOptions
//         );

//         // Creates a new Route53 DNS record pointing the domain to the CloudFront distribution.
//         const zone = aws.route53.getZone({ name: domainParts.parentDomain });
//         const record = new aws.route53.Record(
//             this.args.targetDomain,
//             {
//                 name: domainParts.subdomain ? domainParts.subdomain : this.args.targetDomain,
//                 zoneId: zone.then(zone => zone.zoneId),
//                 type: "A",
//                 aliases: [
//                     {
//                         name: cdn.domainName,
//                         zoneId: cdn.hostedZoneId,
//                         evaluateTargetHealth: true,
//                     }
//                 ],
//             },
//             this.args.certificateARN
//                 ? {
//                     parent: this,
//                 }
//                 : {
//                     parent: this,
//                     dependsOn: certificate,
//                 }
//         );

//         const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity("originAccessIdentity", {
//             comment: "this is needed to setup s3 polices and make s3 not public.",
//         }, this.resourceOptions);

//         // Only allow cloudfront to access content bucket.
//         const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
//             bucket: this.bucket.id, // refer to the bucket created earlier
//             policy: pulumi.all([originAccessIdentity.iamArn, this.bucket.arn]).apply(([oaiArn, bucketArn]) => JSON.stringify({
//                 Version: "2012-10-17",
//                 Statement: [
//                     {
//                         Effect: "Allow",
//                         Principal: {
//                             AWS: oaiArn,
//                         }, // Only allow Cloudfront read access.
//                         Action: ["s3:GetObject"],
//                         Resource: [`${bucketArn}/*`], // Give Cloudfront access to the entire bucket.
//                     }
//                 ],
//             })),
//         },
//         this.resourceOptions);

//         return cdn;
//     }

//     // Construct cloudfront distribution arguments.
//     private configureDistributionArgs (): aws.cloudfront.DistributionArgs {
//         const cacheTtl = this.args.cacheTTL || (10 * 60); // 10 minutes.

//         const bucketOrigin: aws.types.input.cloudfront.DistributionOrigin = {
//             originId: this.bucket.arn,
//             domainName: this.bucket.bucketRegionalDomainName,
//             customOriginConfig: {
//                 originProtocolPolicy: "http-only",
//                 httpPort: 80,
//                 httpsPort: 443,
//                 originSslProtocols: ["TLSv1.2"],
//             },
//         };

//         const distributionArgs: aws.cloudfront.DistributionArgs = {
//             enabled: true,

//             // Alternate aliases the CloudFront distribution can be reached at, in addition to https://xxxx.cloudfront.net.
//             // Required if you want to access the distribution via config.targetDomain as well.

//             aliases: [this.args.targetDomain],

//             // We only specify one origin for this distribution, the S3 content bucket.
//             origins: [
//                 bucketOrigin
//             ],

//             defaultRootObject: this.args.indexHTML,

//             // A CloudFront distribution can configure different cache behaviors based on the request path.
//             // Here we just specify a single, default cache behavior which is just read-only requests to S3.
//             defaultCacheBehavior: {
//                 targetOriginId: this.bucket.arn,

//                 viewerProtocolPolicy: "redirect-to-https",
//                 allowedMethods: ["GET", "HEAD", "OPTIONS"],
//                 cachedMethods: ["GET", "HEAD", "OPTIONS"],

//                 forwardedValues: {
//                     cookies: { forward: "none" },
//                     queryString: false,
//                 },

//                 minTtl: 0,
//                 defaultTtl: cacheTtl,
//                 maxTtl: cacheTtl,
//             },

//             // Determines the price class of the CloudFront distribution based on edge locations used to serve the content.
//             // For more info see: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html
//             priceClass: this.getPriceClass(),

//             // You can customize error responses. When CloudFront receives an error from the origin (e.g. S3 or some other
//             // web service) it can return a different error code, and return the response for a different resource.
//             customErrorResponses: [
//                 { errorCode: 404, responseCode: 404, responsePagePath: `/${this.args.error404}` }
//             ],

//             restrictions: {
//                 geoRestriction: {
//                     restrictionType: "none",
//                 },
//             },

//             viewerCertificate: {
//                 cloudfrontDefaultCertificate: true,
//                 sslSupportMethod: "sni-only",
//             },

//             loggingConfig: this.logsBucket
//                 ? {
//                     bucket: this.logsBucket.bucketDomainName,
//                     includeCookies: false,
//                     prefix: `${this.args.targetDomain}/`,
//                 }
//                 : undefined,
//         };

//         return distributionArgs;
//     }

//     // Provision and validate ACM certificate.
//     private provisionAndValidateCert (bucket: aws.s3.Bucket): aws.acm.Certificate {
//         const eastRegion = new aws.Provider("east", {
//             profile: aws.config.profile,
//             region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region.
//         });

//         const cacheTTL = this.args.cacheTTL || (10 * 60); // 10 minutes.
//         const domainParts = getDomainAndSubdomain(this.args.targetDomain);

//         const certificateConfig: aws.acm.CertificateArgs = {
//             domainName: this.args.targetDomain,
//             validationMethod: "DNS",
//         };

//         const certificate = new aws.acm.Certificate("certificate", certificateConfig, { provider: eastRegion, ...this.resourceOptions });

//         const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain }, { async: true }).then(zone => zone.zoneId);

//         // Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
//         // See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
//         const certificateValidationDomain = new aws.route53.Record("certificate-validation", {
//             name: certificate.domainValidationOptions[0].resourceRecordName,
//             zoneId: hostedZoneId,
//             type: certificate.domainValidationOptions[0].resourceRecordType,
//             records: [certificate.domainValidationOptions[0].resourceRecordValue],
//             ttl: cacheTTL,
//         },
//         {
//             ...this.resourceOptions,
//             dependsOn: certificate,
//         });

//         return certificate;
//     }

//     private getPriceClass (): string {
//         const priceClass = this.args.priceClass || "100";
//         switch (priceClass) {
//         case "100":
//             return "PriceClass_100";
//         case "200":
//             return "PriceClass_200";
//         case "all":
//             return "PriceClass_All";
//         default:
//             return "PriceClass_100";
//         }
//     }
}

// // Split a domain name into its subdomain and parent domain names.
// // e.g. "www.example.com" => "www", "example.com.".
// function getDomainAndSubdomain (domain: string): { subdomain: string, parentDomain: string } {
//     const parts = domain.split(".");
//     if (parts.length < 2) {
//         throw new Error(`No TLD found on ${domain}`);
//     }
//     // No subdomain, e.g. awesome-website.com.
//     if (parts.length === 2) {
//         return { subdomain: "", parentDomain: domain };
//     }

//     const subdomain = parts[0];
//     parts.shift(); // Drop first element.
//     return {
//         subdomain,
//         // Add trailing "." to canonicalize domain.
//         parentDomain: parts.join(".") + ".",
//     };
// }
