# --- Custom domain: ACM certificate (DNS validation; the owner adds the record at their DNS provider),
# then an HTTPS listener once SeekInfra sees the certificate issued. ---
locals {
  has_domain = var.domain.name != ""
  https_on   = local.has_domain && var.domain.certificate_ready
}

resource "aws_acm_certificate" "domain" {
  count             = local.has_domain ? 1 : 0
  domain_name       = var.domain.name
  validation_method = "DNS"
  lifecycle { create_before_destroy = true }
}

resource "aws_lb_listener" "https" {
  count             = local.https_on ? 1 : 0
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.domain[0].arn
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}
