// Code generated by Pulumi SDK Generator DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package awsstaticwebsite

import (
	"context"
	"reflect"

	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/cloudfront"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

type CDNArgs struct {
	// A config block that triggers a cloudfront
	// function with specific actions.
	CloudfrontFunctionAssociations []cloudfront.DistributionOrderedCacheBehaviorFunctionAssociation `pulumi:"cloudfrontFunctionAssociations"`
	// The forwarded values configuration that specifies how CloudFront handles query strings, cookies and headers.
	ForwardedValues *cloudfront.DistributionDefaultCacheBehaviorForwardedValues `pulumi:"forwardedValues"`
	// A config block that triggers a lambda
	// function with specific actions.
	LambdaFunctionAssociations []cloudfront.DistributionOrderedCacheBehaviorLambdaFunctionAssociation `pulumi:"lambdaFunctionAssociations"`
}

// CDNArgsInput is an input type that accepts CDNArgsArgs and CDNArgsOutput values.
// You can construct a concrete instance of `CDNArgsInput` via:
//
//	CDNArgsArgs{...}
type CDNArgsInput interface {
	pulumi.Input

	ToCDNArgsOutput() CDNArgsOutput
	ToCDNArgsOutputWithContext(context.Context) CDNArgsOutput
}

type CDNArgsArgs struct {
	// A config block that triggers a cloudfront
	// function with specific actions.
	CloudfrontFunctionAssociations cloudfront.DistributionOrderedCacheBehaviorFunctionAssociationArrayInput `pulumi:"cloudfrontFunctionAssociations"`
	// The forwarded values configuration that specifies how CloudFront handles query strings, cookies and headers.
	ForwardedValues cloudfront.DistributionDefaultCacheBehaviorForwardedValuesPtrInput `pulumi:"forwardedValues"`
	// A config block that triggers a lambda
	// function with specific actions.
	LambdaFunctionAssociations cloudfront.DistributionOrderedCacheBehaviorLambdaFunctionAssociationArrayInput `pulumi:"lambdaFunctionAssociations"`
}

func (CDNArgsArgs) ElementType() reflect.Type {
	return reflect.TypeOf((*CDNArgs)(nil)).Elem()
}

func (i CDNArgsArgs) ToCDNArgsOutput() CDNArgsOutput {
	return i.ToCDNArgsOutputWithContext(context.Background())
}

func (i CDNArgsArgs) ToCDNArgsOutputWithContext(ctx context.Context) CDNArgsOutput {
	return pulumi.ToOutputWithContext(ctx, i).(CDNArgsOutput)
}

func (i CDNArgsArgs) ToCDNArgsPtrOutput() CDNArgsPtrOutput {
	return i.ToCDNArgsPtrOutputWithContext(context.Background())
}

func (i CDNArgsArgs) ToCDNArgsPtrOutputWithContext(ctx context.Context) CDNArgsPtrOutput {
	return pulumi.ToOutputWithContext(ctx, i).(CDNArgsOutput).ToCDNArgsPtrOutputWithContext(ctx)
}

// CDNArgsPtrInput is an input type that accepts CDNArgsArgs, CDNArgsPtr and CDNArgsPtrOutput values.
// You can construct a concrete instance of `CDNArgsPtrInput` via:
//
//	        CDNArgsArgs{...}
//
//	or:
//
//	        nil
type CDNArgsPtrInput interface {
	pulumi.Input

	ToCDNArgsPtrOutput() CDNArgsPtrOutput
	ToCDNArgsPtrOutputWithContext(context.Context) CDNArgsPtrOutput
}

type cdnargsPtrType CDNArgsArgs

func CDNArgsPtr(v *CDNArgsArgs) CDNArgsPtrInput {
	return (*cdnargsPtrType)(v)
}

func (*cdnargsPtrType) ElementType() reflect.Type {
	return reflect.TypeOf((**CDNArgs)(nil)).Elem()
}

func (i *cdnargsPtrType) ToCDNArgsPtrOutput() CDNArgsPtrOutput {
	return i.ToCDNArgsPtrOutputWithContext(context.Background())
}

func (i *cdnargsPtrType) ToCDNArgsPtrOutputWithContext(ctx context.Context) CDNArgsPtrOutput {
	return pulumi.ToOutputWithContext(ctx, i).(CDNArgsPtrOutput)
}

type CDNArgsOutput struct{ *pulumi.OutputState }

func (CDNArgsOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*CDNArgs)(nil)).Elem()
}

func (o CDNArgsOutput) ToCDNArgsOutput() CDNArgsOutput {
	return o
}

func (o CDNArgsOutput) ToCDNArgsOutputWithContext(ctx context.Context) CDNArgsOutput {
	return o
}

func (o CDNArgsOutput) ToCDNArgsPtrOutput() CDNArgsPtrOutput {
	return o.ToCDNArgsPtrOutputWithContext(context.Background())
}

func (o CDNArgsOutput) ToCDNArgsPtrOutputWithContext(ctx context.Context) CDNArgsPtrOutput {
	return o.ApplyTWithContext(ctx, func(_ context.Context, v CDNArgs) *CDNArgs {
		return &v
	}).(CDNArgsPtrOutput)
}

// A config block that triggers a cloudfront
// function with specific actions.
func (o CDNArgsOutput) CloudfrontFunctionAssociations() cloudfront.DistributionOrderedCacheBehaviorFunctionAssociationArrayOutput {
	return o.ApplyT(func(v CDNArgs) []cloudfront.DistributionOrderedCacheBehaviorFunctionAssociation {
		return v.CloudfrontFunctionAssociations
	}).(cloudfront.DistributionOrderedCacheBehaviorFunctionAssociationArrayOutput)
}

// The forwarded values configuration that specifies how CloudFront handles query strings, cookies and headers.
func (o CDNArgsOutput) ForwardedValues() cloudfront.DistributionDefaultCacheBehaviorForwardedValuesPtrOutput {
	return o.ApplyT(func(v CDNArgs) *cloudfront.DistributionDefaultCacheBehaviorForwardedValues { return v.ForwardedValues }).(cloudfront.DistributionDefaultCacheBehaviorForwardedValuesPtrOutput)
}

// A config block that triggers a lambda
// function with specific actions.
func (o CDNArgsOutput) LambdaFunctionAssociations() cloudfront.DistributionOrderedCacheBehaviorLambdaFunctionAssociationArrayOutput {
	return o.ApplyT(func(v CDNArgs) []cloudfront.DistributionOrderedCacheBehaviorLambdaFunctionAssociation {
		return v.LambdaFunctionAssociations
	}).(cloudfront.DistributionOrderedCacheBehaviorLambdaFunctionAssociationArrayOutput)
}

type CDNArgsPtrOutput struct{ *pulumi.OutputState }

func (CDNArgsPtrOutput) ElementType() reflect.Type {
	return reflect.TypeOf((**CDNArgs)(nil)).Elem()
}

func (o CDNArgsPtrOutput) ToCDNArgsPtrOutput() CDNArgsPtrOutput {
	return o
}

func (o CDNArgsPtrOutput) ToCDNArgsPtrOutputWithContext(ctx context.Context) CDNArgsPtrOutput {
	return o
}

func (o CDNArgsPtrOutput) Elem() CDNArgsOutput {
	return o.ApplyT(func(v *CDNArgs) CDNArgs {
		if v != nil {
			return *v
		}
		var ret CDNArgs
		return ret
	}).(CDNArgsOutput)
}

// A config block that triggers a cloudfront
// function with specific actions.
func (o CDNArgsPtrOutput) CloudfrontFunctionAssociations() cloudfront.DistributionOrderedCacheBehaviorFunctionAssociationArrayOutput {
	return o.ApplyT(func(v *CDNArgs) []cloudfront.DistributionOrderedCacheBehaviorFunctionAssociation {
		if v == nil {
			return nil
		}
		return v.CloudfrontFunctionAssociations
	}).(cloudfront.DistributionOrderedCacheBehaviorFunctionAssociationArrayOutput)
}

// The forwarded values configuration that specifies how CloudFront handles query strings, cookies and headers.
func (o CDNArgsPtrOutput) ForwardedValues() cloudfront.DistributionDefaultCacheBehaviorForwardedValuesPtrOutput {
	return o.ApplyT(func(v *CDNArgs) *cloudfront.DistributionDefaultCacheBehaviorForwardedValues {
		if v == nil {
			return nil
		}
		return v.ForwardedValues
	}).(cloudfront.DistributionDefaultCacheBehaviorForwardedValuesPtrOutput)
}

// A config block that triggers a lambda
// function with specific actions.
func (o CDNArgsPtrOutput) LambdaFunctionAssociations() cloudfront.DistributionOrderedCacheBehaviorLambdaFunctionAssociationArrayOutput {
	return o.ApplyT(func(v *CDNArgs) []cloudfront.DistributionOrderedCacheBehaviorLambdaFunctionAssociation {
		if v == nil {
			return nil
		}
		return v.LambdaFunctionAssociations
	}).(cloudfront.DistributionOrderedCacheBehaviorLambdaFunctionAssociationArrayOutput)
}

func init() {
	pulumi.RegisterInputType(reflect.TypeOf((*CDNArgsInput)(nil)).Elem(), CDNArgsArgs{})
	pulumi.RegisterInputType(reflect.TypeOf((*CDNArgsPtrInput)(nil)).Elem(), CDNArgsArgs{})
	pulumi.RegisterOutputType(CDNArgsOutput{})
	pulumi.RegisterOutputType(CDNArgsPtrOutput{})
}
