# Pulumi AWS Static Website Component

This component makes it easy to deploy a static website to s3 along with an optional CloudFront distribution using any of the supported Pulumi programming languages including markup languages like YAML and JSON.

## Example Usage

### Simple (only s3 bucket)

Typescript:
```typescript
const args =  {
    sitePath: "../website/build",
} as staticwebsite.WebsiteArgs

const site = new staticwebsite.Website("website", args);
```

YAML:
```yaml
resources:
  web:
    type: "aws-static-website:index:Website"
    properties:
      sitePath: "../website/build"
outputs:
  website: ${web.websiteURL}
```

### With CloudFront CDN

Typescript:
```typescript
const args =  {
    withCDN: true,
    sitePath: "../website/build",
    targetDomain: "my-awesome-site.com",
    withLogs: true,
    cacheTTL: 600,
} as staticwebsite.WebsiteArgs

const site = new staticwebsite.Website("website", args);

```

YAML:
```yaml
resources:
  web:
    type: "aws-static-website:index:Website"
    properties:
      withCDN: true
      sitePath: "../website/build"
      targetDomain: "my-awesome-site.com"
      withLogs: true
      cacheTTL: 600
outputs:
  website: ${web.websiteURL}
```
See the examples directory for fully working examples of how to consume this component.

## Input Properties

This component takes the following inputs.

- sitePath (string) - the root directory containing the website's contents to be served (required)
- withCDN (boolean) - provision a CloudFront CDN to serve content
- targetDomain (string) - the domain used to serve the content. A Route53 hosted zone must exist for this domain is this option is specified
- index.html (string) - the default document for the site. Defaults to index.html
- error404 (string) - the default 404 error page
- certificateARN (string) - the ARN of the ACM certificate to use for serving HTTPS. If one is not provided, a certificate will be created during the provisioning process
- cacheTTL (number) - TTL inseconds for cached objects
- withLogs (boolean) - provision a bucket to house access logs

## Outputs

- bucketName - the name of the s3 bucket containing the website's contents
- bucketWebsiteURL - the website URL for the s3 bucket
- cdnDomainName - the CDN domain name
- cdnURL - the CDN's endpoint URL
- logsBucketName - the name of the s3 bucket containing the access logs
- websiteURL - the URL to access the website


## Notes:

- If specifying a target domain and provisioning a CloudFront distribution, it is assumed there is a hosted zone configured in route53 for that target domain.
- If you already have an ACM certificate provisioned for your domain, then you can simply pass the ARN as one of the input properties. If not we will attempt to provision one for you based on the target domain provided.
