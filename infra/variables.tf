variable "project_id" {
  type        = string
  description = "The GCP Project ID where resources will be created"
}

variable "region" {
  type        = string
  description = "The region to provision the cluster in"
  default     = "us-central1"
}

variable "cluster_name" {
  type        = string
  description = "The name of the GKE Autopilot cluster"
  default     = "booking-platform-v2"
}

variable "network_name" {
  type        = string
  description = "The name of the custom VPC network"
  default     = "nr-gke-vpc"
}

variable "subnet_name" {
  type        = string
  description = "The name of the custom subnet"
  default     = "nr-gke-subnet"
}

variable "newrelic_license_key" {
  type        = string
  description = "The New Relic License Key (Fetch from Secret Manager in prod)"
  sensitive   = true
}
variable "newrelic_account_id" {
  type        = string
  description = "Your New Relic Account ID"
}

variable "newrelic_api_key" {
  type        = string
  description = "New Relic User API Key"
  sensitive   = true
}
