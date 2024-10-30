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

import { execSync } from "child_process";
import { local } from "@pulumi/command";
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as mime from "mime";
import * as path from "path";
import * as fs from "fs";
import { PublicBucketPolicy } from "./publicBucketPolicy";

interface CdnArgs {
    forwardedValues?: aws.types.input.cloudfront.DistributionDefaultCacheBehaviorForwardedValues;
    cloudfrontFunctionAssociations?: aws.types.input.cloudfront.DistributionOrderedCacheBehaviorFunctionAssociation[];
    lambdaFunctionAssociations?: aws.types.input.cloudfront.DistributionOrderedCacheBehaviorLambdaFunctionAssociation[];
}

export interface WebsiteArgs {
    sitePath: string;
    indexHTML: string;
    error403?: string;
    error404: string;
    withCDN: boolean;
    cdnArgs?: CdnArgs;
    priceClass: string;
    targetDomain: string;
    certificateARN?: string;
    cacheTTL?: number;
    withLogs?: boolean;
    subdomain?: string;
    atomicDeployments?: boolean;
    addWebsiteVersionHeader?: boolean;
}

/**
 *  A Pulumi component that provisions an S3 static website with an optional CloudFront CDN.
*/
export class Website extends pulumi.ComponentResource {
    private bucket: aws.s3.Bucket;
    private logsBucket?: aws.s3.Bucket;
    private args: WebsiteArgs;
    private resourceOptions: pulumi.CustomResourceOptions;
    private buildIdentifier = new Date().getTime();

    bucketName?: pulumi.Output<string>;
    bucketWebsiteURL?: pulumi.Output<string>;
    websiteURL?: pulumi.Output<string>;
    websiteLogsBucketName?: pulumi.Output<string>;
    cdnDomainName?: pulumi.Output<string>;
    cdnURL?: pulumi.Output<string>;

    constructor (name: string, args: WebsiteArgs, opts?: pulumi.CustomResourceOptions) {
        super("pulumi-aws-static-website:index:Website", name, args, opts);
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

        // Check the error document exists if specified.
        if (args.error403 && !fs.existsSync(path.join(args.sitePath, args.error403))) {
            pulumi.log.warn(`Default document "${args.error403}" does not exist.`);
        }

        // Get the current stack and check the outputs.
        let lastBucketDeployed: pulumi.Output<any> = pulumi.output("");
        if (args.atomicDeployments) {
            const currentStackName = `${this.getOrganizationName()}/${pulumi.getProject()}/${pulumi.getStack()}`;
            const currentStack = new pulumi.StackReference(currentStackName);
            lastBucketDeployed = currentStack.getOutput("bucketName");
        }

        // Provision content bucket.
        if (args.atomicDeployments) {
            this.bucket = this.provisionContentBucketSync(lastBucketDeployed);
        } else {
            this.bucket = this.provisionContentBucket();
        }

        this.bucketName = this.bucket.bucket;
        this.bucketWebsiteURL = pulumi.interpolate`http://${this.bucket.websiteEndpoint}`;
        this.websiteURL = pulumi.interpolate`http://${this.bucket.websiteEndpoint}`;

        // Provision logs bucket if specified in config.
        if (this.args.withLogs) {
            this.logsBucket = this.provisionLogsBucket();
            this.websiteLogsBucketName = this.logsBucket.bucket;
        }

        // If the user specified withCDN, provision CloudFront distribution.
        if (this.bucket && this.args.withCDN) {
            const cdn = this.provisionCDN();
            this.cdnDomainName = cdn.domainName;
            this.cdnURL = pulumi.interpolate`https://${cdn.domainName}`;
            if (this.args.targetDomain) {
                this.websiteURL = pulumi.interpolate`https://${this.args.targetDomain}`;
            } else {
                this.websiteURL = pulumi.interpolate`https://${cdn.domainName}`;
            }

        }

        this.registerOutputs({
            bucketName: this.bucketName,
            bucketWebsiteURL: this.bucketWebsiteURL,
            cdnDomainName: this.cdnDomainName,
            cdnURL: this.cdnURL,
            websiteURL: this.args.withCDN ? this.websiteURL : this.bucketWebsiteURL,
            logsBucketName: this.logsBucket?.bucket,
        });
    }

    private getOrganizationName(): string {
        const config = new pulumi.Config();
        const organizationNameOverride = config.get("pulumiOrganizationName");
        if (organizationNameOverride) {
            return organizationNameOverride;
        }

        const [ organization = "" ] = execSync(`pulumi --stack=${pulumi.getStack()} stack`)
            .toString()
            .match(/(?<=Owner: )[^\n]+/) ?? [];

        if (organization == "") {
            throw new Error("pulumi organization not found, set the organization name in your config file to resolve this error by running `pulumi config set pulumiOrganizationName <org name>`");
        }

        return organization;
    }

    // Provision s3 bucket to contain the website contents.
    private provisionContentBucket (): aws.s3.Bucket {
        const bucketName = `${this.args.targetDomain || "website"}-content`;
        const contentBucket = new aws.s3.Bucket(
            bucketName,
            {
                bucket: this.args.targetDomain ? bucketName : undefined,
                website: {
                    indexDocument: this.args.indexHTML,
                    errorDocument: this.args.error404,
                },
                forceDestroy: true,

            },
            this.resourceOptions);

        const publicPolicy = new PublicBucketPolicy("public-bucket-policy", {
            bucket: contentBucket,
        }, this.resourceOptions)

        const webContentsRootPath = path.join(process.cwd(), this.args.sitePath);
        this.putContents(contentBucket, publicPolicy, webContentsRootPath);

        return contentBucket;
    }

    // Provision s3 bucket to contain the website contents.
    private provisionContentBucketSync(lastBucketName: pulumi.Output<any>): aws.s3.Bucket {
        const baseBucketName = `${this.args.targetDomain || "website"}-content`;
        const bucketName = `${baseBucketName}-${this.buildIdentifier}`;

        const currentBucket = new aws.s3.Bucket(bucketName, {
            bucket: bucketName,
            website: {
                indexDocument: this.args.indexHTML,
                errorDocument: this.args.error404,
            },
            forceDestroy: true,
        }, this.resourceOptions);

        const publicPolicy = new PublicBucketPolicy("public-bucket-policy", {
            bucket: currentBucket,
        }, this.resourceOptions);

        lastBucketName.apply(n => {
            if (n) {
                const bName = n.split(".")[0];
                const previousBucket = new aws.s3.Bucket(bName, {
                    bucket: bName,
                    website: {
                        indexDocument: this.args.indexHTML,
                        errorDocument: this.args.error404,
                    },
                    forceDestroy: true,
                }, this.resourceOptions);

                const previousPublicPolicy = new PublicBucketPolicy("public-bucket-policy", {
                    bucket: previousBucket,
                }, this.resourceOptions);
            } else {
                pulumi.log.info("output `bucketName` not found on stack, will remove old bucket after new bucket is provisioned and associated");
            }
        });

        const webContentsRootPath = path.join(process.cwd(), this.args.sitePath);

        if (this.args.atomicDeployments === undefined) {
            this.putContents(currentBucket, publicPolicy, webContentsRootPath);
            return currentBucket;
        }

        this.putContentsSync(currentBucket, publicPolicy, webContentsRootPath);
        return currentBucket;
    }

    // Provision logs bucket for the CDN's request logs.
    private provisionLogsBucket (): aws.s3.Bucket {
        const bucketName = `${this.args.targetDomain || "website"}-logs`;
        return new aws.s3.Bucket(
            bucketName,
            {
                bucket: bucketName,
                acl: "private",
                forceDestroy: true,
            },
            this.resourceOptions);
    }

    // Upload website content to s3 content bucket.
    private putContents (bucket: aws.s3.Bucket, publicPolicy: PublicBucketPolicy, rootDir: string) {
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

        pulumi.log.info(`Provisioning bucket objects for contents from local disk at ${rootDir}.`);
        crawlDirectory(
            rootDir,
            (filePath: string) => {
                const relativeFilePath = filePath.replace(rootDir + "/", "");
                const contentFile = new aws.s3.BucketObject(
                    relativeFilePath,
                    {
                        key: relativeFilePath,

                        acl: "public-read",
                        bucket,
                        contentType: mime.getType(filePath) || undefined,
                        source: new pulumi.asset.FileAsset(filePath),
                    },
                    {
                        parent: bucket,
                        dependsOn: [ publicPolicy.ownershipControls, publicPolicy.publicAccessBlock ],
                    });
            });
    }

    // Upload website content to s3 content bucket.
    private putContentsSync(bucket: aws.s3.Bucket, publicPolicy: PublicBucketPolicy, rootDir: string) {
        pulumi.log.info(`Syncing contents from local disk at ${rootDir}.`);

        const destinationBucketURI = bucket.bucket.apply((b) => `s3://${b}`);

        const cmd = process.platform === "win32" ?
            this.buildWindowsCMD(rootDir, destinationBucketURI, bucket.region) :
            `aws s3 sync "$BUILD_DIR" "$DESTINATION_BUCKET" --acl public-read --delete --quiet --region "$REGION"`;

        new local.Command("sync_bucket", {
            create: cmd,
            environment: {
                BUILD_DIR: rootDir,
                DESTINATION_BUCKET: destinationBucketURI,
                REGION: bucket.region,

                // This tells Pulumi to rerun the command on every run.
                REBUILD_TRIGGER: new Date().getTime().toString(),
            },
        }, { dependsOn: [ publicPolicy.ownershipControls, publicPolicy.publicAccessBlock ] });
    }

    // Build windows command using interpolation. For some reason the command provider does not correctly interpolate the environment variables
    // in the command on windows machines.... so we will do it ourselves.
    private buildWindowsCMD(buildDir: string, destinationBucket: pulumi.Output<string>, region: pulumi.Output<string>): pulumi.Output<string> {
        // Since windows decided to use backslashes for filepaths and backslashes are escape characters everywhere else in the world, replace
        // "\" with "\\" because the single backslash gets removed so we need to re-escape it :eye-roll:
        const dir = buildDir.replace(/\\/g, "\\\\");
        return pulumi.interpolate `aws s3 sync ${buildDir} ${destinationBucket} --acl public-read --delete --quiet --region ${region}`;
    }

    // Provision CloudFront CDN.
    private provisionCDN (): aws.cloudfront.Distribution {
        let cdn: aws.cloudfront.Distribution;
        let certificate;

        const distributionArgs = this.configureDistributionArgs();

        // If no DNS info was provided, provision a CloudFront CDN with the default settings.
        if (!this.args.targetDomain) {
            distributionArgs.aliases = [];
            distributionArgs.viewerCertificate = {
                cloudfrontDefaultCertificate: true,
                sslSupportMethod: "sni-only",
            };

            if (this.args.certificateARN) {
                distributionArgs.viewerCertificate = {
                    cloudfrontDefaultCertificate: false,
                    acmCertificateArn: this.args.certificateARN,
                    sslSupportMethod: "sni-only",
                };
            }

            cdn = new aws.cloudfront.Distribution(
                "website-cdn",
                distributionArgs,
                this.resourceOptions
            );
            return cdn;
        }

        if (this.args.certificateARN) {
            distributionArgs.viewerCertificate = {
                cloudfrontDefaultCertificate: false,
                acmCertificateArn: this.args.certificateARN,
                sslSupportMethod: "sni-only",
            };
        } else {
            let certificateValidation;
            [certificate, certificateValidation] = this.provisionAndValidateCert(this.bucket);
            distributionArgs.viewerCertificate = {
                cloudfrontDefaultCertificate: false,
                acmCertificateArn: certificateValidation.certificateArn,
                sslSupportMethod: "sni-only",
            };
        }

        const domainParts = getDomainAndSubdomain(this.args.targetDomain);
        this.websiteURL = pulumi.interpolate`http://${this.args.targetDomain}`;

        cdn = new aws.cloudfront.Distribution(
            "website-cdn",
            distributionArgs,
            this.resourceOptions
        );

        // Creates a new Route53 DNS record pointing the domain to the CloudFront distribution.
        const zone = aws.route53.getZone({ name: domainParts.parentDomain });
        const record = new aws.route53.Record(
            this.args.targetDomain,
            {
                name: domainParts.subdomain ? domainParts.subdomain : this.args.targetDomain,
                zoneId: zone.then(zone => zone.zoneId),
                type: "A",
                aliases: [
                    {
                        name: cdn.domainName,
                        zoneId: cdn.hostedZoneId,
                        evaluateTargetHealth: true,
                    }
                ],
            },
            this.args.certificateARN
                ? {
                    parent: this,
                }
                : {
                    parent: this,
                    dependsOn: certificate,
                }
        );

        if (this.args.subdomain) {
            const subdomainRecord = new aws.route53.Record(
                `${this.args.targetDomain}-subdomain-alias`,
                {
                    name: `${this.args.subdomain}.${this.args.targetDomain}`,
                    zoneId: zone.then(zone => zone.zoneId),
                    type: "A",
                    aliases: [
                        {
                            name: cdn.domainName,
                            zoneId: cdn.hostedZoneId,
                            evaluateTargetHealth: true,
                        },
                    ],
                },
            );
        }

        const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity("originAccessIdentity", {
            comment: "this is needed to setup s3 polices and make s3 not public.",
        }, this.resourceOptions);

        // Only allow cloudfront to access content bucket.
        const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
            bucket: this.bucket.id, // refer to the bucket created earlier
            policy: pulumi.all([originAccessIdentity.iamArn, this.bucket.arn]).apply(([oaiArn, bucketArn]) => JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: {
                            AWS: oaiArn,
                        }, // Only allow Cloudfront read access.
                        Action: ["s3:GetObject"],
                        Resource: [`${bucketArn}/*`], // Give Cloudfront access to the entire bucket.
                    }
                ],
            })),
        },
        this.resourceOptions);

        return cdn;
    }

    // Construct cloudfront distribution arguments.
    private configureDistributionArgs (): aws.cloudfront.DistributionArgs {
        const cacheTtl = this.args.cacheTTL || (10 * 60); // 10 minutes.

        const cfFunctions = this.args?.cdnArgs?.cloudfrontFunctionAssociations ?? [];
        const lambdaFunctions = this.args?.cdnArgs?.lambdaFunctionAssociations ?? [];

        if ((cfFunctions.length > 2) || (cfFunctions.length > 1 && this.args.addWebsiteVersionHeader)){
            let max = this.args.addWebsiteVersionHeader ? 1 : 2;
            throw new Error(`too many cloudfront functions provided, maximum ${max}`)
        }

        if (lambdaFunctions.length > 4) {
            throw new Error("too many lambda functions provided, maximum 4");
        }

        const bucketOrigin: aws.types.input.cloudfront.DistributionOrigin = {
            originId: this.bucket.arn,
            domainName: this.bucket.bucketRegionalDomainName,
            customOriginConfig: {
                originProtocolPolicy: "http-only",
                httpPort: 80,
                httpsPort: 443,
                originSslProtocols: ["TLSv1.2"],
            },
        };

        if (this.args.addWebsiteVersionHeader) {
            const cfBuildHeader = this.provisionCloudfrontFunction()
            cfFunctions.push({
                eventType: "viewer-request",
                functionArn: cfBuildHeader.arn,
            });
        }

        const cacheForwardedValues = this.args?.cdnArgs?.forwardedValues;
        const cacheForwardHeaders = pulumi.output(cacheForwardedValues?.headers).apply((headers) => {
            const result = headers ?? [];

            if (this.args.addWebsiteVersionHeader) {
                return [ "Website Version", ...result ];
            }

            return result;
        });

        const forwardedValues = {
            headers: cacheForwardHeaders,
            cookies: cacheForwardedValues?.cookies ?? { forward: "none" },
            queryString: cacheForwardedValues?.queryString ?? false,
        };

        const distributionAliases = this.args.subdomain ? [this.args.targetDomain, `${this.args.subdomain}.${this.args.targetDomain}`] : [this.args.targetDomain];

        const distributionArgs: aws.cloudfront.DistributionArgs = {
            enabled: true,

            // Alternate aliases the CloudFront distribution can be reached at, in addition to https://xxxx.cloudfront.net.
            // Required if you want to access the distribution via config.targetDomain as well.

            aliases: distributionAliases,

            // We only specify one origin for this distribution, the S3 content bucket.
            origins: [
                bucketOrigin
            ],

            defaultRootObject: this.args.indexHTML,

            // A CloudFront distribution can configure different cache behaviors based on the request path.
            // Here we just specify a single, default cache behavior which is just read-only requests to S3.
            defaultCacheBehavior: {
                forwardedValues,
                targetOriginId: this.bucket.arn,

                viewerProtocolPolicy: "redirect-to-https",
                allowedMethods: ["GET", "HEAD", "OPTIONS"],
                cachedMethods: ["GET", "HEAD", "OPTIONS"],

                minTtl: 0,
                defaultTtl: cacheTtl,
                maxTtl: cacheTtl,

                functionAssociations: cfFunctions,
                lambdaFunctionAssociations: lambdaFunctions,
            },

            // Determines the price class of the CloudFront distribution based on edge locations used to serve the content.
            // For more info see: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html
            priceClass: this.getPriceClass(),

            // You can customize error responses. When CloudFront receives an error from the origin (e.g. S3 or some other
            // web service) it can return a different error code, and return the response for a different resource.
            customErrorResponses: [
                { errorCode: 404, responseCode: 404, responsePagePath: `/${this.args.error404}` },
                { errorCode: 403, responseCode: 403, responsePagePath: `/${this.args.error403}` }
            ],

            restrictions: {
                geoRestriction: {
                    restrictionType: "none",
                },
            },

            viewerCertificate: {
                cloudfrontDefaultCertificate: true,
                sslSupportMethod: "sni-only",
            },

            loggingConfig: this.logsBucket
                ? {
                    bucket: this.logsBucket.bucketDomainName,
                    includeCookies: false,
                    prefix: `${this.args.targetDomain}/`,
                }
                : undefined,
        };

        return distributionArgs;
    }

    // Create a Cloudfront function for adding the build identifier
    // as a cache key.
    private provisionCloudfrontFunction(): aws.cloudfront.Function {
        return new aws.cloudfront.Function("build-identifier-header", {
            runtime: "cloudfront-js-1.0",
            publish: true,
            code: createCloudfrontBuildIdentifierFunction(this.buildIdentifier.toString()),
        });
    }

    // Provision and validate ACM certificate.
    private provisionAndValidateCert (bucket: aws.s3.Bucket): [aws.acm.Certificate, aws.acm.CertificateValidation] {
        const eastRegion = new aws.Provider("east", {
            profile: aws.config.profile,
            region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region.
        });

        const cacheTTL = this.args.cacheTTL || (10 * 60); // 10 minutes.
        const domainParts = getDomainAndSubdomain(this.args.targetDomain);

        const certificateConfig: aws.acm.CertificateArgs = {
            domainName: this.args.targetDomain,
            validationMethod: "DNS",
            subjectAlternativeNames: this.args.subdomain ? [`${this.args.subdomain}.${this.args.targetDomain}`] : [],
        };

        const certificate = new aws.acm.Certificate("certificate", certificateConfig, { provider: eastRegion, ...this.resourceOptions });

        const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain }, { async: true }).then(zone => zone.zoneId);

        // Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
        // See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
        const certificateValidationDomain = new aws.route53.Record("certificate-validation", {
            name: certificate.domainValidationOptions[0].resourceRecordName,
            zoneId: hostedZoneId,
            type: certificate.domainValidationOptions[0].resourceRecordType,
            records: [certificate.domainValidationOptions[0].resourceRecordValue],
            ttl: cacheTTL,
        },
        {
            ...this.resourceOptions,
            dependsOn: certificate,
        });

        const subdomainCertificateValidationDomain = this.args.subdomain ? new aws.route53.Record(`subdomain-certificate-validation`, {
            name: certificate.domainValidationOptions[1].resourceRecordName,
            zoneId: hostedZoneId,
            type: certificate.domainValidationOptions[1].resourceRecordType,
            records: [certificate.domainValidationOptions[1].resourceRecordValue],
            ttl: cacheTTL,
        }) : undefined;

        const validationRecordFqdns = subdomainCertificateValidationDomain === undefined ?
        [certificateValidationDomain.fqdn] : [certificateValidationDomain.fqdn, subdomainCertificateValidationDomain.fqdn];

        // Note: the CertificationValidation resource is just here to allow us to wait until the validation is complete
        // before continuing and doesn't actually provision anything at all.
        const certificateValidation = new aws.acm.CertificateValidation("certificateValidation", {
            certificateArn: certificate.arn,
            validationRecordFqdns: validationRecordFqdns,
        }, { provider: eastRegion });

        return [certificate, certificateValidation];
    }

    private getPriceClass (): string {
        const priceClass = this.args.priceClass || "100";
        switch (priceClass) {
        case "100":
            return "PriceClass_100";
        case "200":
            return "PriceClass_200";
        case "all":
            return "PriceClass_All";
        default:
            return "PriceClass_100";
        }
    }
}

function createCloudfrontBuildIdentifierFunction(buildIdentifier: string): string {
    return `function handler(event){
    var request = event.request;

    request.headers["website-version"] = {
        value: "${buildIdentifier}",
    };

    return request;
}`;
}

// Split a domain name into its subdomain and parent domain names.
// e.g. "www.example.com" => "www", "example.com.".
function getDomainAndSubdomain (domain: string): { subdomain: string, parentDomain: string } {
    const parts = domain.split(".");
    if (parts.length < 2) {
        throw new Error(`No TLD found on ${domain}`);
    }
    // No subdomain, e.g. awesome-website.com.
    if (parts.length === 2) {
        return { subdomain: "", parentDomain: domain };
    }

    const subdomain = parts[0];
    parts.shift(); // Drop first element.
    return {
        subdomain,
        // Add trailing "." to canonicalize domain.
        parentDomain: parts.join(".") + ".",
    };
}
