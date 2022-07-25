//import { local } from "@pulumi/command";
import * as pulumi from "@pulumi/pulumi";
//import * as aws from "@pulumi/aws";

export interface AtomicBucketsArgs {

}

interface AtomicBucketsInputs {

}

class BucketSyncResourceProvider implements pulumi.dynamic.ResourceProvider {
    constructor(
        private name: string,
    ) {}

    private async createWebsiteBucket(): Promise<string> {
        const websiteBucketName = `${this.name}-${new Date().getTime()}`;
        return websiteBucketName;
    }

    async check(olds: AtomicBucketsInputs, news: AtomicBucketsInputs): Promise<pulumi.dynamic.CheckResult> {
        return { inputs: news };
    }

    async diff(): Promise<pulumi.dynamic.DiffResult> {
        return {
            deleteBeforeReplace: false,
            changes: true,
        };
    }

    async read(id: string, currentOutputs: AtomicBucketsOutputs): Promise<pulumi.dynamic.ReadResult> {
        return { id, props: currentOutputs };
    }

    async create(inputs: AtomicBucketsInputs): Promise<pulumi.dynamic.CreateResult> {
        // Create a new S3 bucket website.
        const websiteBucket = await this.createWebsiteBucket();

        const outs: AtomicBucketsOutputs = {
            currentBucket: websiteBucket,
        };

        // Return bucket as an output.
        return { id: this.name, outs };
    }

    async delete(id: string, currentOutputs: AtomicBucketsOutputs): Promise<void> {

    }

    async update(id: string, currentOutputs: AtomicBucketsOutputs, newInputs: AtomicBucketsInputs): Promise<pulumi.dynamic.UpdateResult> {
        // Create a new bucket.
        const newBucket = await this.createWebsiteBucket();

        // Promote the new bucket to be the current bucket and demote the
        // current bucket to be the new fallback.
        const outs: AtomicBucketsOutputs = {
            currentBucket: newBucket,
            previousBucket: currentOutputs.currentBucket,
        };

        // Update outputs.
        return { outs };
    }
}

interface AtomicBucketsOutputs {
    currentBucket: string;
    previousBucket?: string;
}

export class AtomicBuckets extends pulumi.dynamic.Resource {
    public readonly currentBucket!: string;
    public readonly previousBucket?: string;

    constructor(name: string, args: AtomicBucketsArgs, opts?: pulumi.CustomResourceOptions) {
        super(new BucketSyncResourceProvider(name), `aws:s3:BucketSync:${name}`, args, opts);
    }
}
