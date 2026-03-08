# Project Implementation Plan: GKE & New Relic Integration

This document outlines the phased implementation plan for provisioning a GKE Autopilot cluster and instrumenting it with New Relic.

## Phase 1: Foundation (GCP Infrastructure)
- **Goal:** Provision a secure GKE Autopilot cluster.
- **Components:** VPC, Subnets with secondary ranges, Cloud NAT, and GKE Autopilot Cluster.
- **Provider:** `hashicorp/google-beta`.

## Phase 2: Instrumentation (Cluster Monitoring)
- **Goal:** Deploy the New Relic Infrastructure bundle.
- **Components:** `nri-bundle` Helm chart.
- **Mechanism:** Terraform `local-exec` provisioner using native Helm CLI.
- **Constraint Handling:** Specific tuning for GKE Autopilot (disabling eBPF, non-privileged mode).

## Phase 3: Observability as Code (Work in Progress)
- **Goal:** Manage Alerts and Dashboards via Terraform.
- **Components:** New Relic Alert Policies, NRQL Conditions, and Dashboards.
- **Provider:** `newrelic/newrelic`.

## Phase 4: Validation
- **Goal:** Ensure data is flowing and automation is robust.
- **Steps:** Verify Pod status, Perform Destroy/Create cycle.
