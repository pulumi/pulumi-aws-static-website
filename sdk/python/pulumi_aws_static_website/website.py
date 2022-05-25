# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import warnings
import pulumi
import pulumi.runtime
from typing import Any, Mapping, Optional, Sequence, Union, overload
from . import _utilities

__all__ = ['WebsiteArgs', 'Website']

@pulumi.input_type
class WebsiteArgs:
    def __init__(__self__, *,
                 site_path: pulumi.Input[str],
                 cache_ttl: Optional[pulumi.Input[float]] = None,
                 certificate_arn: Optional[pulumi.Input[str]] = None,
                 error404: Optional[pulumi.Input[str]] = None,
                 index_html: Optional[pulumi.Input[str]] = None,
                 price_class: Optional[pulumi.Input[str]] = None,
                 target_domain: Optional[pulumi.Input[str]] = None,
                 with_cdn: Optional[pulumi.Input[bool]] = None,
                 with_logs: Optional[pulumi.Input[bool]] = None):
        """
        The set of arguments for constructing a Website resource.
        :param pulumi.Input[str] site_path: The root directory containing the website's contents.
        :param pulumi.Input[float] cache_ttl: TTL in seconds for cached objects. 
        :param pulumi.Input[str] certificate_arn: The ARN of the ACM certificate to use for serving HTTPS. If one is not provided, a certificate will be created during th providioning process.
        :param pulumi.Input[str] error404: default 404 page
        :param pulumi.Input[str] index_html: index.HTML page
        :param pulumi.Input[str] price_class: The price class to use for the CloudFront configuration. Defaults to 100 if not specified. Valid values are `all`, `100`, and `200`
        :param pulumi.Input[str] target_domain: The domain used to serve the content. A Route53 hosted zone must exist for this domain.
        :param pulumi.Input[bool] with_cdn: Provision CloudFront CDN to serve content.
        :param pulumi.Input[bool] with_logs: Provision a bucket to hold access logs.
        """
        pulumi.set(__self__, "site_path", site_path)
        if cache_ttl is not None:
            pulumi.set(__self__, "cache_ttl", cache_ttl)
        if certificate_arn is not None:
            pulumi.set(__self__, "certificate_arn", certificate_arn)
        if error404 is not None:
            pulumi.set(__self__, "error404", error404)
        if index_html is not None:
            pulumi.set(__self__, "index_html", index_html)
        if price_class is not None:
            pulumi.set(__self__, "price_class", price_class)
        if target_domain is not None:
            pulumi.set(__self__, "target_domain", target_domain)
        if with_cdn is not None:
            pulumi.set(__self__, "with_cdn", with_cdn)
        if with_logs is not None:
            pulumi.set(__self__, "with_logs", with_logs)

    @property
    @pulumi.getter(name="sitePath")
    def site_path(self) -> pulumi.Input[str]:
        """
        The root directory containing the website's contents.
        """
        return pulumi.get(self, "site_path")

    @site_path.setter
    def site_path(self, value: pulumi.Input[str]):
        pulumi.set(self, "site_path", value)

    @property
    @pulumi.getter(name="cacheTTL")
    def cache_ttl(self) -> Optional[pulumi.Input[float]]:
        """
        TTL in seconds for cached objects. 
        """
        return pulumi.get(self, "cache_ttl")

    @cache_ttl.setter
    def cache_ttl(self, value: Optional[pulumi.Input[float]]):
        pulumi.set(self, "cache_ttl", value)

    @property
    @pulumi.getter(name="certificateARN")
    def certificate_arn(self) -> Optional[pulumi.Input[str]]:
        """
        The ARN of the ACM certificate to use for serving HTTPS. If one is not provided, a certificate will be created during th providioning process.
        """
        return pulumi.get(self, "certificate_arn")

    @certificate_arn.setter
    def certificate_arn(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "certificate_arn", value)

    @property
    @pulumi.getter
    def error404(self) -> Optional[pulumi.Input[str]]:
        """
        default 404 page
        """
        return pulumi.get(self, "error404")

    @error404.setter
    def error404(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "error404", value)

    @property
    @pulumi.getter(name="indexHTML")
    def index_html(self) -> Optional[pulumi.Input[str]]:
        """
        index.HTML page
        """
        return pulumi.get(self, "index_html")

    @index_html.setter
    def index_html(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "index_html", value)

    @property
    @pulumi.getter(name="priceClass")
    def price_class(self) -> Optional[pulumi.Input[str]]:
        """
        The price class to use for the CloudFront configuration. Defaults to 100 if not specified. Valid values are `all`, `100`, and `200`
        """
        return pulumi.get(self, "price_class")

    @price_class.setter
    def price_class(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "price_class", value)

    @property
    @pulumi.getter(name="targetDomain")
    def target_domain(self) -> Optional[pulumi.Input[str]]:
        """
        The domain used to serve the content. A Route53 hosted zone must exist for this domain.
        """
        return pulumi.get(self, "target_domain")

    @target_domain.setter
    def target_domain(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "target_domain", value)

    @property
    @pulumi.getter(name="withCDN")
    def with_cdn(self) -> Optional[pulumi.Input[bool]]:
        """
        Provision CloudFront CDN to serve content.
        """
        return pulumi.get(self, "with_cdn")

    @with_cdn.setter
    def with_cdn(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "with_cdn", value)

    @property
    @pulumi.getter(name="withLogs")
    def with_logs(self) -> Optional[pulumi.Input[bool]]:
        """
        Provision a bucket to hold access logs.
        """
        return pulumi.get(self, "with_logs")

    @with_logs.setter
    def with_logs(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "with_logs", value)


class Website(pulumi.ComponentResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 cache_ttl: Optional[pulumi.Input[float]] = None,
                 certificate_arn: Optional[pulumi.Input[str]] = None,
                 error404: Optional[pulumi.Input[str]] = None,
                 index_html: Optional[pulumi.Input[str]] = None,
                 price_class: Optional[pulumi.Input[str]] = None,
                 site_path: Optional[pulumi.Input[str]] = None,
                 target_domain: Optional[pulumi.Input[str]] = None,
                 with_cdn: Optional[pulumi.Input[bool]] = None,
                 with_logs: Optional[pulumi.Input[bool]] = None,
                 __props__=None):
        """
        Create a Website resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        :param pulumi.Input[float] cache_ttl: TTL in seconds for cached objects. 
        :param pulumi.Input[str] certificate_arn: The ARN of the ACM certificate to use for serving HTTPS. If one is not provided, a certificate will be created during th providioning process.
        :param pulumi.Input[str] error404: default 404 page
        :param pulumi.Input[str] index_html: index.HTML page
        :param pulumi.Input[str] price_class: The price class to use for the CloudFront configuration. Defaults to 100 if not specified. Valid values are `all`, `100`, and `200`
        :param pulumi.Input[str] site_path: The root directory containing the website's contents.
        :param pulumi.Input[str] target_domain: The domain used to serve the content. A Route53 hosted zone must exist for this domain.
        :param pulumi.Input[bool] with_cdn: Provision CloudFront CDN to serve content.
        :param pulumi.Input[bool] with_logs: Provision a bucket to hold access logs.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: WebsiteArgs,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        Create a Website resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param WebsiteArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(WebsiteArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 cache_ttl: Optional[pulumi.Input[float]] = None,
                 certificate_arn: Optional[pulumi.Input[str]] = None,
                 error404: Optional[pulumi.Input[str]] = None,
                 index_html: Optional[pulumi.Input[str]] = None,
                 price_class: Optional[pulumi.Input[str]] = None,
                 site_path: Optional[pulumi.Input[str]] = None,
                 target_domain: Optional[pulumi.Input[str]] = None,
                 with_cdn: Optional[pulumi.Input[bool]] = None,
                 with_logs: Optional[pulumi.Input[bool]] = None,
                 __props__=None):
        if opts is None:
            opts = pulumi.ResourceOptions()
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.version is None:
            opts.version = _utilities.get_version()
        if opts.id is not None:
            raise ValueError('ComponentResource classes do not support opts.id')
        else:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = WebsiteArgs.__new__(WebsiteArgs)

            __props__.__dict__["cache_ttl"] = cache_ttl
            __props__.__dict__["certificate_arn"] = certificate_arn
            __props__.__dict__["error404"] = error404
            __props__.__dict__["index_html"] = index_html
            __props__.__dict__["price_class"] = price_class
            if site_path is None and not opts.urn:
                raise TypeError("Missing required property 'site_path'")
            __props__.__dict__["site_path"] = site_path
            __props__.__dict__["target_domain"] = target_domain
            __props__.__dict__["with_cdn"] = with_cdn
            __props__.__dict__["with_logs"] = with_logs
            __props__.__dict__["bucket_name"] = None
            __props__.__dict__["bucket_website_url"] = None
            __props__.__dict__["cdn_domain_name"] = None
            __props__.__dict__["cdn_url"] = None
            __props__.__dict__["logs_bucket_name"] = None
            __props__.__dict__["website_url"] = None
        super(Website, __self__).__init__(
            'aws-static-website:index:Website',
            resource_name,
            __props__,
            opts,
            remote=True)

    @property
    @pulumi.getter(name="bucketName")
    def bucket_name(self) -> pulumi.Output[str]:
        """
        The name of the s3 bucket containing the website contents.
        """
        return pulumi.get(self, "bucket_name")

    @property
    @pulumi.getter(name="bucketWebsiteURL")
    def bucket_website_url(self) -> pulumi.Output[str]:
        """
        The website URL for the s3 bucket.
        """
        return pulumi.get(self, "bucket_website_url")

    @property
    @pulumi.getter(name="cdnDomainName")
    def cdn_domain_name(self) -> pulumi.Output[Optional[str]]:
        """
        The domain name for the CDN.
        """
        return pulumi.get(self, "cdn_domain_name")

    @property
    @pulumi.getter(name="cdnURL")
    def cdn_url(self) -> pulumi.Output[Optional[str]]:
        """
        The URL for the CDN
        """
        return pulumi.get(self, "cdn_url")

    @property
    @pulumi.getter(name="logsBucketName")
    def logs_bucket_name(self) -> pulumi.Output[Optional[str]]:
        """
        The name of the s3 bucket containing the access logs.
        """
        return pulumi.get(self, "logs_bucket_name")

    @property
    @pulumi.getter(name="websiteURL")
    def website_url(self) -> pulumi.Output[str]:
        """
        The URL to access the website
        """
        return pulumi.get(self, "website_url")

