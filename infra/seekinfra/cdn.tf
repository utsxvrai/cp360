# --- HTTPS: CloudFront in front of the load balancer. Gives an https://*.cloudfront.net address with
# AWS's certificate (no domain needed). Nothing is cached; every request goes to the app. ---
# AWS-managed policies (global, fixed IDs): Managed-CachingDisabled and Managed-AllViewerExceptHostHeader.
# Literal IDs instead of data sources so turning the CDN off leaves nothing behind in state.
locals {
  cf_cache_disabled      = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  cf_all_viewer_requests = "b689b0a8-53d0-40ab-baf2-68738e2966ac"
}

resource "aws_cloudfront_distribution" "app" {
  count           = var.cdn_enabled ? 1 : 0
  enabled         = true
  comment         = local.name
  is_ipv6_enabled = true
  price_class     = "PriceClass_200"

  origin {
    origin_id   = "alb"
    domain_name = aws_lb.main.dns_name
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
      origin_read_timeout    = 60
    }
  }

  default_cache_behavior {
    target_origin_id         = "alb"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = local.cf_cache_disabled
    origin_request_policy_id = local.cf_all_viewer_requests
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
