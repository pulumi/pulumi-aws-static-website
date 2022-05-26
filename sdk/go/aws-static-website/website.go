// Code generated by Pulumi SDK Generator DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package awsstaticwebsite

import (
	"context"
	"reflect"

	"github.com/pkg/errors"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

type Website struct {
	pulumi.ResourceState

	// The name of the s3 bucket containing the website contents.
	BucketName pulumi.StringOutput `pulumi:"bucketName"`
	// The website URL for the s3 bucket.
	BucketWebsiteURL pulumi.StringOutput `pulumi:"bucketWebsiteURL"`
	// The domain name for the CDN.
	CdnDomainName pulumi.StringPtrOutput `pulumi:"cdnDomainName"`
	// The URL for the CDN
	CdnURL pulumi.StringPtrOutput `pulumi:"cdnURL"`
	// The name of the s3 bucket containing the access logs.
	LogsBucketName pulumi.StringPtrOutput `pulumi:"logsBucketName"`
	// The URL to access the website
	WebsiteURL pulumi.StringOutput `pulumi:"websiteURL"`
}

// NewWebsite registers a new resource with the given unique name, arguments, and options.
func NewWebsite(ctx *pulumi.Context,
	name string, args *WebsiteArgs, opts ...pulumi.ResourceOption) (*Website, error) {
	if args == nil {
		return nil, errors.New("missing one or more required arguments")
	}

	if args.SitePath == nil {
		return nil, errors.New("invalid value for required argument 'SitePath'")
	}
	var resource Website
	err := ctx.RegisterRemoteComponentResource("aws-static-website:index:Website", name, args, &resource, opts...)
	if err != nil {
		return nil, err
	}
	return &resource, nil
}

type websiteArgs struct {
	// TTL in seconds for cached objects.
	CacheTTL *float64 `pulumi:"cacheTTL"`
	// The ARN of the ACM certificate to use for serving HTTPS. If one is not provided, a certificate will be created during the provisioning process.
	CertificateARN *string `pulumi:"certificateARN"`
	// default 404 page
	Error404 *string `pulumi:"error404"`
	// The default document for the site. Defaults to index.html
	IndexHTML *string `pulumi:"indexHTML"`
	// The price class to use for the CloudFront configuration. Defaults to 100 if not specified. Valid values are `all`, `100`, and `200`
	PriceClass *string `pulumi:"priceClass"`
	// The root directory containing the website's contents.
	SitePath string `pulumi:"sitePath"`
	// The domain used to serve the content. A Route53 hosted zone must exist for this domain.
	TargetDomain *string `pulumi:"targetDomain"`
	// Provision CloudFront CDN to serve content.
	WithCDN *bool `pulumi:"withCDN"`
	// Provision a bucket to hold access logs.
	WithLogs *bool `pulumi:"withLogs"`
}

// The set of arguments for constructing a Website resource.
type WebsiteArgs struct {
	// TTL in seconds for cached objects.
	CacheTTL pulumi.Float64PtrInput
	// The ARN of the ACM certificate to use for serving HTTPS. If one is not provided, a certificate will be created during the provisioning process.
	CertificateARN pulumi.StringPtrInput
	// default 404 page
	Error404 pulumi.StringPtrInput
	// The default document for the site. Defaults to index.html
	IndexHTML pulumi.StringPtrInput
	// The price class to use for the CloudFront configuration. Defaults to 100 if not specified. Valid values are `all`, `100`, and `200`
	PriceClass pulumi.StringPtrInput
	// The root directory containing the website's contents.
	SitePath pulumi.StringInput
	// The domain used to serve the content. A Route53 hosted zone must exist for this domain.
	TargetDomain pulumi.StringPtrInput
	// Provision CloudFront CDN to serve content.
	WithCDN pulumi.BoolPtrInput
	// Provision a bucket to hold access logs.
	WithLogs pulumi.BoolPtrInput
}

func (WebsiteArgs) ElementType() reflect.Type {
	return reflect.TypeOf((*websiteArgs)(nil)).Elem()
}

type WebsiteInput interface {
	pulumi.Input

	ToWebsiteOutput() WebsiteOutput
	ToWebsiteOutputWithContext(ctx context.Context) WebsiteOutput
}

func (*Website) ElementType() reflect.Type {
	return reflect.TypeOf((**Website)(nil)).Elem()
}

func (i *Website) ToWebsiteOutput() WebsiteOutput {
	return i.ToWebsiteOutputWithContext(context.Background())
}

func (i *Website) ToWebsiteOutputWithContext(ctx context.Context) WebsiteOutput {
	return pulumi.ToOutputWithContext(ctx, i).(WebsiteOutput)
}

// WebsiteArrayInput is an input type that accepts WebsiteArray and WebsiteArrayOutput values.
// You can construct a concrete instance of `WebsiteArrayInput` via:
//
//          WebsiteArray{ WebsiteArgs{...} }
type WebsiteArrayInput interface {
	pulumi.Input

	ToWebsiteArrayOutput() WebsiteArrayOutput
	ToWebsiteArrayOutputWithContext(context.Context) WebsiteArrayOutput
}

type WebsiteArray []WebsiteInput

func (WebsiteArray) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*Website)(nil)).Elem()
}

func (i WebsiteArray) ToWebsiteArrayOutput() WebsiteArrayOutput {
	return i.ToWebsiteArrayOutputWithContext(context.Background())
}

func (i WebsiteArray) ToWebsiteArrayOutputWithContext(ctx context.Context) WebsiteArrayOutput {
	return pulumi.ToOutputWithContext(ctx, i).(WebsiteArrayOutput)
}

// WebsiteMapInput is an input type that accepts WebsiteMap and WebsiteMapOutput values.
// You can construct a concrete instance of `WebsiteMapInput` via:
//
//          WebsiteMap{ "key": WebsiteArgs{...} }
type WebsiteMapInput interface {
	pulumi.Input

	ToWebsiteMapOutput() WebsiteMapOutput
	ToWebsiteMapOutputWithContext(context.Context) WebsiteMapOutput
}

type WebsiteMap map[string]WebsiteInput

func (WebsiteMap) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*Website)(nil)).Elem()
}

func (i WebsiteMap) ToWebsiteMapOutput() WebsiteMapOutput {
	return i.ToWebsiteMapOutputWithContext(context.Background())
}

func (i WebsiteMap) ToWebsiteMapOutputWithContext(ctx context.Context) WebsiteMapOutput {
	return pulumi.ToOutputWithContext(ctx, i).(WebsiteMapOutput)
}

type WebsiteOutput struct{ *pulumi.OutputState }

func (WebsiteOutput) ElementType() reflect.Type {
	return reflect.TypeOf((**Website)(nil)).Elem()
}

func (o WebsiteOutput) ToWebsiteOutput() WebsiteOutput {
	return o
}

func (o WebsiteOutput) ToWebsiteOutputWithContext(ctx context.Context) WebsiteOutput {
	return o
}

// The name of the s3 bucket containing the website contents.
func (o WebsiteOutput) BucketName() pulumi.StringOutput {
	return o.ApplyT(func(v *Website) pulumi.StringOutput { return v.BucketName }).(pulumi.StringOutput)
}

// The website URL for the s3 bucket.
func (o WebsiteOutput) BucketWebsiteURL() pulumi.StringOutput {
	return o.ApplyT(func(v *Website) pulumi.StringOutput { return v.BucketWebsiteURL }).(pulumi.StringOutput)
}

// The domain name for the CDN.
func (o WebsiteOutput) CdnDomainName() pulumi.StringPtrOutput {
	return o.ApplyT(func(v *Website) pulumi.StringPtrOutput { return v.CdnDomainName }).(pulumi.StringPtrOutput)
}

// The URL for the CDN
func (o WebsiteOutput) CdnURL() pulumi.StringPtrOutput {
	return o.ApplyT(func(v *Website) pulumi.StringPtrOutput { return v.CdnURL }).(pulumi.StringPtrOutput)
}

// The name of the s3 bucket containing the access logs.
func (o WebsiteOutput) LogsBucketName() pulumi.StringPtrOutput {
	return o.ApplyT(func(v *Website) pulumi.StringPtrOutput { return v.LogsBucketName }).(pulumi.StringPtrOutput)
}

// The URL to access the website
func (o WebsiteOutput) WebsiteURL() pulumi.StringOutput {
	return o.ApplyT(func(v *Website) pulumi.StringOutput { return v.WebsiteURL }).(pulumi.StringOutput)
}

type WebsiteArrayOutput struct{ *pulumi.OutputState }

func (WebsiteArrayOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*Website)(nil)).Elem()
}

func (o WebsiteArrayOutput) ToWebsiteArrayOutput() WebsiteArrayOutput {
	return o
}

func (o WebsiteArrayOutput) ToWebsiteArrayOutputWithContext(ctx context.Context) WebsiteArrayOutput {
	return o
}

func (o WebsiteArrayOutput) Index(i pulumi.IntInput) WebsiteOutput {
	return pulumi.All(o, i).ApplyT(func(vs []interface{}) *Website {
		return vs[0].([]*Website)[vs[1].(int)]
	}).(WebsiteOutput)
}

type WebsiteMapOutput struct{ *pulumi.OutputState }

func (WebsiteMapOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*Website)(nil)).Elem()
}

func (o WebsiteMapOutput) ToWebsiteMapOutput() WebsiteMapOutput {
	return o
}

func (o WebsiteMapOutput) ToWebsiteMapOutputWithContext(ctx context.Context) WebsiteMapOutput {
	return o
}

func (o WebsiteMapOutput) MapIndex(k pulumi.StringInput) WebsiteOutput {
	return pulumi.All(o, k).ApplyT(func(vs []interface{}) *Website {
		return vs[0].(map[string]*Website)[vs[1].(string)]
	}).(WebsiteOutput)
}

func init() {
	pulumi.RegisterInputType(reflect.TypeOf((*WebsiteInput)(nil)).Elem(), &Website{})
	pulumi.RegisterInputType(reflect.TypeOf((*WebsiteArrayInput)(nil)).Elem(), WebsiteArray{})
	pulumi.RegisterInputType(reflect.TypeOf((*WebsiteMapInput)(nil)).Elem(), WebsiteMap{})
	pulumi.RegisterOutputType(WebsiteOutput{})
	pulumi.RegisterOutputType(WebsiteArrayOutput{})
	pulumi.RegisterOutputType(WebsiteMapOutput{})
}
