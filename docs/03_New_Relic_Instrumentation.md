# New Relic Instrumentation: Helm & Local-Exec

This document explains how New Relic is deployed to the GKE Autopilot cluster.

## Deployment Strategy
We use a **Hybrid Approach**:
- **Terraform State Management:** The `null_resource` in Terraform tracks the deployment.
- **Native Helm CLI:** A `local-exec` provisioner executes standard `helm` commands for maximum compatibility and easier troubleshooting.

## GKE Autopilot Compatibility
GKE Autopilot has strict security constraints (no privileged containers, no hostile hostPath mounts). 

### Required Tuning (`values-autopilot.yaml`):
- `global.privileged: false`: Disables privileged mode across all agents.
- `nr-ebpf-agent.enabled: false`: Disabled as it requires kernel-level access and privileged volumes prohibited by Autopilot.
- `newrelic-logging.fluentBit.persistence.mode: none`: Prevents hostPath violations for logging buffers.

## Automation Logic
The `observability_local_exec.tf` file contains two triggers:
1. **Create Provisioner:** Runs after cluster creation. Authenticates via `gcloud` and runs `helm upgrade --install`.
2. **Destroy Provisioner:** Runs during `terraform destroy`. Safely runs `helm uninstall` and deletes the `newrelic` namespace.

## Manual Commands
A helper script is provided for manual deployment/testing:
- `helm/deploy-newrelic.sh`
