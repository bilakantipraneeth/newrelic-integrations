output "cluster_name" {
  description = "The name of the provisioned GKE Autopilot cluster"
  value       = google_container_cluster.autopilot_cluster.name
}

output "cluster_endpoint" {
  description = "The IP address of the cluster master"
  value       = google_container_cluster.autopilot_cluster.endpoint
}

output "ca_certificate" {
  description = "The public certificate that is the root of trust for the cluster"
  value       = google_container_cluster.autopilot_cluster.master_auth[0].cluster_ca_certificate
  sensitive   = true
}

output "workload_identity_pool" {
  description = "The GCP Workload Identity pool linked to the cluster"
  value       = google_container_cluster.autopilot_cluster.workload_identity_config[0].workload_pool
}
