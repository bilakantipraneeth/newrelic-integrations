# New Relic Infrastructure Monitoring for GKE

This document explains how New Relic monitors the Google Kubernetes Engine (GKE) Autopilot cluster and providing full-stack observability.

## 🏗️ Architecture Overview

New Relic monitoring on GKE is implemented using a collection of specialized components bundled together in the **`nri-bundle`** Helm chart.

### 1. The `nri-bundle` Components
When we deploy the infrastructure via Terraform, the `newrelic_infrastructure.tf` script triggers the installation of these core elements:

- **Infrastructure Agent (DaemonSet)**: Runs on every node (managed by Autopilot) to collect CPU, memory, and disk metrics.
- **Kube-State-Metrics (KSM)**: A service that listens to the Kubernetes API server and generates metrics about the state of the objects (deployments, pods, replicas, etc.).
- **Control Plane Monitoring**: Collects data from the API server and scheduler.
- **K8s Events Integration**: Captures events like `PodReady`, `Scheduled`, and critical errors like `BackOff` or `OOMKill`.

## 🛰️ GKE Autopilot Specific Configurations

GKE Autopilot has a "hardened" security model that restricts certain low-level operations. New Relic requires a specific configuration (`values-autopilot.yaml`) to operate within these constraints:

### 1. Security & Privileges
- **`global.privileged: false`**: Unlike standard GKE, Autopilot strictly denies privileged containers. The New Relic agent is configured to run in non-privileged mode.
- **`nr-ebpf-agent.enabled: false`**: eBPF-based monitoring (Deep Observability) is disabled because it requires low-level kernel and host-filesystem access that Autopilot blocks.
- **`newrelic-pixie.enabled: false`**: Pixie (for network flow visualization) is also disabled as it relies on eBPF.

### 2. Provider Identity
- **`global.provider: GKE_AUTOPILOT`**: This flag explicitly informs the New Relic backend that it is receiving data from an Autopilot cluster, which affects how metrics are processed and displayed.

### 3. Log Persistence
- **`newrelic-logging.fluentBit.persistence.mode: none`**: Standard Fluent Bit uses local host-path persistence to track where it left off in log files. Autopilot prevents writing to these paths, so persistence is set to `none`.

### 4. Efficient Data Transfer
- **`global.lowDataMode: true`**: Reduces the frequency and volume of non-essential metrics to optimize for Autopilot's resource-based pricing model and to minimize overhead.

## 📊 Visualizing the Infrastructure

Once the `nri-bundle` is active, the data is accessible via:

- **Kubernetes Explorer**: A high-level visual map of the entire cluster, showing the health of Nodes and Pods.
- **Node Analysis**: Drill-down views into individual GKE node performance.
- **Pod & Container Metrics**: Performance stats for every microservice (User, Booking, etc.).
- **Log Management**: If enabled, container logs are forwarded to New Relic and correlated with APM traces.

## 🛠️ Configuration (Terraform)

The integration is managed as code in `infra/newrelic_infrastructure.tf`:

```hcl
resource "null_resource" "newrelic_k8s_integration" {
  provisioner "local-exec" {
    command = "helm upgrade --install newrelic-bundle newrelic/nri-bundle ..."
  }
}
```

This ensures that every time the cluster is provisioned, the observability layer is automatically attached, providing "Day 0" visibility.
