// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../types";

import * as pulumiAws from "@pulumi/aws";

export interface CDNArgsArgs {
    /**
     * A config block that triggers a cloudfront
     * function with specific actions.
     */
    cloudfrontFunctions?: pulumi.Input<pulumi.Input<pulumiAws.types.input.cloudfront.DistributionOrderedCacheBehaviorFunctionAssociation>[]>;
    /**
     * The forwarded values configuration that specifies how CloudFront handles query strings, cookies and headers.
     */
    forwardedValues?: pulumi.Input<pulumiAws.types.input.cloudfront.DistributionDefaultCacheBehaviorForwardedValues>;
    /**
     * A config block that triggers a lambda
     * function with specific actions.
     */
    lambdaFunctions?: pulumi.Input<pulumi.Input<pulumiAws.types.input.cloudfront.DistributionOrderedCacheBehaviorLambdaFunctionAssociation>[]>;
}
