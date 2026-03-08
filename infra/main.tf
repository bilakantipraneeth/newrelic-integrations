resource "google_container_cluster" "autopilot_cluster" {
  provider = google-beta

  name     = var.cluster_name
  project  = var.project_id
  location = var.region

  # Enable GKE Autopilot
  enable_autopilot = true

  # Networking
  network    = google_compute_network.vpc_network.self_link
  subnetwork = google_compute_subnetwork.subnet.self_link

  ip_allocation_policy {
    cluster_secondary_range_name  = "pods-subnet"
    services_secondary_range_name = "services-subnet"
  }

  # Release Channel
  release_channel {
    channel = "REGULAR"
  }

  # Workload Identity is enabled by default on Autopilot, but explicitly state it
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Allow Terraform to delete the cluster
  deletion_protection = false
}
