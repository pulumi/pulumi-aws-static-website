import pulumi
from pulumi_aws_static_website import Website

web = Website('website',
    sitePath="../website/build")

pulumi.export('websiteURL',  web.websiteURL)

