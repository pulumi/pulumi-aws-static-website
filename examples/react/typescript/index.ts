import * as staticwebsite from "@pulumi/aws-static-website"

const websiteArgs =  {
    withCDN: true,
    sitePath: "../website/build",
    withLogs: true,
    cacheTTL: 600,
    indexHTML: "index.html",
    targetDomain: "dev.holung.com"
} as staticwebsite.WebsiteArgs

const web = new staticwebsite.Website("test", websiteArgs);

// Export the name of the bucket
// export const bucketName = bucket.id;
export const bucketName = web.bucketName;
export const bucketWebsiteURL = web.bucketWebsiteURL;
export const cdnDomainName = web.cdnDomainName;
export const cdnURL = web.cdnURL;
export const websiteURL = web.websiteURL;
export const logsBucketName = web.logsBucketName
