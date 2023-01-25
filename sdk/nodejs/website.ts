// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "./types";
import * as utilities from "./utilities";

import * as pulumiAws from "@pulumi/aws";

export class Website extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'aws-static-website:index:Website';

    /**
     * Returns true if the given object is an instance of Website.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is Website {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === Website.__pulumiType;
    }

    /**
     * The name of the s3 bucket containing the website contents.
     */
    public /*out*/ readonly bucketName!: pulumi.Output<string>;
    /**
     * The website URL for the s3 bucket.
     */
    public /*out*/ readonly bucketWebsiteURL!: pulumi.Output<string>;
    /**
     * The domain name for the CDN.
     */
    public /*out*/ readonly cdnDomainName!: pulumi.Output<string | undefined>;
    /**
     * The URL for the CDN
     */
    public /*out*/ readonly cdnURL!: pulumi.Output<string | undefined>;
    /**
     * The name of the s3 bucket containing the access logs.
     */
    public /*out*/ readonly logsBucketName!: pulumi.Output<string | undefined>;
    /**
     * The URL to access the website
     */
    public /*out*/ readonly websiteURL!: pulumi.Output<string>;

    /**
     * Create a Website resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: WebsiteArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.sitePath === undefined) && !opts.urn) {
                throw new Error("Missing required property 'sitePath'");
            }
            resourceInputs["addWebsiteVersionHeader"] = args ? args.addWebsiteVersionHeader : undefined;
            resourceInputs["atomicDeployments"] = args ? args.atomicDeployments : undefined;
            resourceInputs["cacheTTL"] = args ? args.cacheTTL : undefined;
            resourceInputs["cdnArgs"] = args ? args.cdnArgs : undefined;
            resourceInputs["certificateARN"] = args ? args.certificateARN : undefined;
            resourceInputs["error404"] = args ? args.error404 : undefined;
            resourceInputs["indexHTML"] = args ? args.indexHTML : undefined;
            resourceInputs["priceClass"] = args ? args.priceClass : undefined;
            resourceInputs["sitePath"] = args ? args.sitePath : undefined;
            resourceInputs["subdomain"] = args ? args.subdomain : undefined;
            resourceInputs["targetDomain"] = args ? args.targetDomain : undefined;
            resourceInputs["withCDN"] = args ? args.withCDN : undefined;
            resourceInputs["withLogs"] = args ? args.withLogs : undefined;
            resourceInputs["bucketName"] = undefined /*out*/;
            resourceInputs["bucketWebsiteURL"] = undefined /*out*/;
            resourceInputs["cdnDomainName"] = undefined /*out*/;
            resourceInputs["cdnURL"] = undefined /*out*/;
            resourceInputs["logsBucketName"] = undefined /*out*/;
            resourceInputs["websiteURL"] = undefined /*out*/;
        } else {
            resourceInputs["bucketName"] = undefined /*out*/;
            resourceInputs["bucketWebsiteURL"] = undefined /*out*/;
            resourceInputs["cdnDomainName"] = undefined /*out*/;
            resourceInputs["cdnURL"] = undefined /*out*/;
            resourceInputs["logsBucketName"] = undefined /*out*/;
            resourceInputs["websiteURL"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(Website.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}

/**
 * The set of arguments for constructing a Website resource.
 */
export interface WebsiteArgs {
    /**
     * Enable a cache control header to be attached to every request from an Cloudfront Function.
     */
    addWebsiteVersionHeader?: pulumi.Input<boolean>;
    /**
     * Provision a new bucket on each deployment.
     */
    atomicDeployments?: pulumi.Input<boolean>;
    /**
     * TTL in seconds for cached objects. 
     */
    cacheTTL?: pulumi.Input<number>;
    /**
     * Optional arguments used to configure the CDN.
     */
    cdnArgs?: pulumi.Input<inputs.CDNArgsArgs>;
    /**
     * The ARN of the ACM certificate to use for serving HTTPS. If one is not provided, a certificate will be created during the provisioning process.
     */
    certificateARN?: pulumi.Input<string>;
    /**
     * default 404 page
     */
    error404?: pulumi.Input<string>;
    /**
     * The default document for the site. Defaults to index.html
     */
    indexHTML?: pulumi.Input<string>;
    /**
     * The price class to use for the CloudFront configuration. Defaults to 100 if not specified. Valid values are `all`, `100`, and `200`
     */
    priceClass?: pulumi.Input<string>;
    /**
     * The root directory containing the website's contents.
     */
    sitePath: pulumi.Input<string>;
    /**
     * An optional subdomain that can be used to serve the content. This can typically be used to provision a www alias or if a deeply nested subdomain is needed (e.g. foo.bar.baz.com).
     */
    subdomain?: pulumi.Input<string>;
    /**
     * The domain used to serve the content. A Route53 hosted zone must exist for this domain.
     */
    targetDomain?: pulumi.Input<string>;
    /**
     * Provision CloudFront CDN to serve content.
     */
    withCDN?: pulumi.Input<boolean>;
    /**
     * Provision a bucket to hold access logs.
     */
    withLogs?: pulumi.Input<boolean>;
}
