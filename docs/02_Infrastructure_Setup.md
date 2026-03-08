# Infrastructure Setup: GKE Autopilot

This document details the Terraform configuration for the Google Kubernetes Engine (GKE) Autopilot environment.

## Networking Architecture
We use a **VPC-Native** architecture, which is a requirement for GKE Autopilot.

- **VPC Network:** `nr-gke-vpc`
- **Subnet:** `nr-gke-subnet` in `us-central1`.
- **Secondary Ranges:**
    - `pods-subnet`: For Kubernetes Pod IP addresses.
    - `services-subnet`: For Kubernetes Service IP addresses.
- **Cloud NAT:** Provisions a NAT Gateway to allow private nodes to reach the internet (required for pulls from New Relic's Helm repository).

## GKE Autopilot Configuration
The cluster is provisioned with `enable_autopilot = true`.

### Key Features:
- **Workload Identity:** Enabled by default, allowing Kubernetes Service Accounts to impersonate GCP Service Accounts.
- **Release Channel:** Set to `REGULAR` for a balance between stability and new features.
- **Binary Authorization:** Configurable for advanced security (optional).

## Terraform Files
- `network.tf`: Defines the VPC, Subnet, Router, and NAT.
- `main.tf`: Defines the GKE cluster.
- `variables.tf`: Configuration parameters.
- `outputs.tf`: Exports cluster endpoint and CA certificate.
