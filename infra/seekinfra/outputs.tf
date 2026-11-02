output "url" {
  value = local.https_on ? "https://${var.domain.name}" : var.cdn_enabled ? "https://${try(aws_cloudfront_distribution.app[0].domain_name, "")}" : "http://${aws_lb.main.dns_name}"
}
output "alb_url" { value = "http://${aws_lb.main.dns_name}" }
output "ecr_repository_url" { value = aws_ecr_repository.app.repository_url }
output "cluster_name" { value = aws_ecs_cluster.main.name }
output "service_name" { value = aws_ecs_service.app.name }
output "db_identifier" { value = try(aws_db_instance.main[0].identifier, "") }
output "bucket" { value = try(aws_s3_bucket.files[0].bucket, "") }
output "access_logs_bucket" { value = try(aws_s3_bucket.alb_logs[0].bucket, "") }
