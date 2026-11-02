# --- Load balancer access logs (one gzip file per node every 5 minutes), kept 30 days. ---
data "aws_elb_service_account" "main" {}

resource "aws_s3_bucket" "alb_logs" {
  count         = var.access_logs ? 1 : 0
  bucket_prefix = "${substr(local.name, 0, 24)}-logs-"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "alb_logs" {
  count                   = var.access_logs ? 1 : 0
  bucket                  = aws_s3_bucket.alb_logs[0].id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "alb_logs" {
  count  = var.access_logs ? 1 : 0
  bucket = aws_s3_bucket.alb_logs[0].id
  rule {
    id     = "expire"
    status = "Enabled"
    filter {}
    expiration { days = 30 }
  }
}

data "aws_iam_policy_document" "alb_logs" {
  count = var.access_logs ? 1 : 0
  statement {
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.alb_logs[0].arn}/alb/AWSLogs/*"]
    principals {
      type        = "AWS"
      identifiers = [data.aws_elb_service_account.main.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "alb_logs" {
  count  = var.access_logs ? 1 : 0
  bucket = aws_s3_bucket.alb_logs[0].id
  policy = data.aws_iam_policy_document.alb_logs[0].json
}
