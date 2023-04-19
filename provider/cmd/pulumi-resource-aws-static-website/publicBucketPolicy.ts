// Copyright 2016-2023, Pulumi Corporation.
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

export interface PublicBucketPolicyArgs {
    bucket: aws.s3.Bucket;
}

export class PublicBucketPolicy extends pulumi.ComponentResource {
    public readonly ownershipControls!: aws.s3.BucketOwnershipControls;
    public readonly publicAccessBlock!: aws.s3.BucketPublicAccessBlock;

    constructor(name: string, args: PublicBucketPolicyArgs, opts?: pulumi.ComponentResourceOptions) {
        super("pulumi-aws-static-website:index:PublicBucketPolicy", name, args, opts);

        const resourceOpts = { ...opts, parent: this };

        const ownershipControls = new aws.s3.BucketOwnershipControls("ownership-controls", {
            bucket: args.bucket.id,
            rule: {
                objectOwnership: "ObjectWriter"
            }
        }, resourceOpts);

        const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("public-access-block", {
            bucket: args.bucket.id,
            blockPublicAcls: false,
        }, resourceOpts);

        this.registerOutputs({
            ownershipControls,
            publicAccessBlock,
        });
    }
}
