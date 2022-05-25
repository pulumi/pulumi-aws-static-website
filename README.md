# Pulumi AWS Static Website Component

This component makes it easy to deploy a static website to s3 using any of the supported Pulumi programming languages such as TypeScript, Python, Go C#, Java, or markup languages like YAML and JSON. It can also optionally provison and configure a CloudFront distribution.


## Example Usage

Typescript:
```typescript
const args =  {
    withCDN: true,
    sitePath: "../website/build",
    targetDomain: "my-awesome-site.com",
    withLogs: true,
    cacheTTL: 600,
    indexHTML: "index.html",
} as staticwebsite.WebsiteArgs

const web = new staticwebsite.Website("website", args);

```

YAML:
```yaml
resources:
  web:
    type: "aws-static-website:index:Website"
    properties:
      withCDN: true
      sitePath: "../website/build"
      targetDomain: "holung.com"
      withLogs: true
outputs:
  website: ${web.websiteURL}
```
See the examples directory for fully working examples of how to consume this component.

## Input Properties

```json
    "withCDN": {
        "type": "boolean",
        "description": "Provision a CloudFront CDN to serve content."
    },
    "targetDomain": {
        "type": "string",
        "description": "The domain used to serve the content. A Route53 hosted zone must exist for this domain."
    },
    "sitePath": {
        "type": "string",
        "description": "The root directory containing the website's contents."
    },
    "indexHTML": {
        "type": "string",
        "description": "index.HTML page"
    },
    "error404": {
        "type": "string",
        "description": "default 404 page"
    },
    "certificateARN": {
        "type": "string",
        "description": "The ARN of the ACM certificate to use for serving HTTPS. If one is not provided, a certificate will be created during th providioning process."
    },
    "cacheTTL": {
        "type": "number",
        "description": "TTL in seconds for cached objects. "
    },
    "withLogs": {
        "type": "boolean",
        "description": "Provision a bucket to hold access logs."
    }
```

## Outputs

```json
    {
        "bucketName": {
            "type": "string",
            "description": "The name of the s3 bucket containing the website contents."
        },
        "bucketWebsiteURL": {
            "type": "string",
            "description": "The website URL for the s3 bucket."
        },
        "cdnDomainName" : {
            "type": "string",
            "description": "The CDN domain name."
        },
        "cdnURL" : {
            "type": "string",
            "description": "The CDN URL"
        },
        "logsBucketName": {
            "type": "string",
            "description": "The name of the s3 bucket containing the access logs."
        },
        "websiteURL": {
            "type": "string",
            "description": "The URL to access the website"
        }
    }
```

## Notes:

- If specifying a target domain and provisioning a CloudFront distribution, it is assumed there is a hosted zone configured in route53 for that target domain.
- If you already have an ACM certificate provisioned for your domain, then you can simply pass the ARN as one of the input properties. If not we will attempt to provision one for you based on the target domain provided.
