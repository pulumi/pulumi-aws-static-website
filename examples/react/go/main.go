package main

import (
	awsstaticwebsite "github.com/pulumi/pulumi-aws-static-website/sdk/go/aws-static-website"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {

		website, err := awsstaticwebsite.NewWebsite(ctx, "website", &awsstaticwebsite.WebsiteArgs{
			SitePath: pulumi.String("../website/build"),
		})
		if err != nil {
			return err
		}

		ctx.Export("websiteURL", website.WebsiteURL)
		return nil
	})
}
