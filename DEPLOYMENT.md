# 🚀 Booking Platform — Deployment Guide

## Architecture Overview

This platform is a Spring Boot microservice mesh backed by:
- **GKE Autopilot** — fully managed Kubernetes cluster on GCP
- **Helm** — packaging and deployment of all 9 services
- **Terraform** — infrastructure as code (GKE + VPC + New Relic)
- **New Relic** — observability (APM, dashboards, alerts)
- **GCP Artifact Registry** — container image storage

```
┌──────────────────────────────────────────────┐
│                  GKE Autopilot                │
│                                              │
│  [api-gateway (LoadBalancer)]                │
│      ├── [user-service]                      │
│      ├── [booking-service]                   │
│      │       ├── [inventory-service]         │
│      │       └── [notification-service]      │
│      ├── [payment-service]                   │
│      └── [ingestion-service]                 │
│                                              │
│  [discovery-server (Eureka)]                 │
│  [frontend (Nginx)]                          │
└──────────────────────────────────────────────┘
```

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Terraform | >= 1.5 | `winget install HashiCorp.Terraform` |
| gcloud CLI | latest | https://cloud.google.com/sdk/docs/install |
| kubectl | latest | `gcloud components install kubectl` |
| Helm | >= 3.12 | https://helm.sh/docs/intro/install |
| Docker | latest | https://www.docker.com/products/docker-desktop |
| Java | 17 | `winget install Microsoft.OpenJDK.17` |
| Maven | 3.9+ | https://maven.apache.org/install.html |

---

## Step 1: GCP Authentication

```powershell
# Login to GCP
gcloud auth login
gcloud auth application-default login

# Set your project
gcloud config set project praneeth1211-gcp-pilot
```

---

## Step 2: Build & Push Docker Images to Artifact Registry

Ensure Docker is running and you are authenticated:

```powershell
gcloud auth configure-docker us-central1-docker.pkg.dev
```

Then, for each Java service, build and push:

```powershell
$REGISTRY = "us-central1-docker.pkg.dev/praneeth1211-gcp-pilot/newrelic-platform"
$SERVICES = @("user-service", "booking-service", "inventory-service", "payment-service", "ingestion-service", "notification-service", "discovery-server", "api-gateway")

foreach ($svc in $SERVICES) {
    Push-Location "apps/$svc"
    mvn clean package -DskipTests
    docker build -t "$REGISTRY/${svc}:latest" .
    docker push "$REGISTRY/${svc}:latest"
    Pop-Location
}

# Frontend
Push-Location "apps/frontend"
docker build -t "$REGISTRY/frontend:latest" .
docker push "$REGISTRY/frontend:latest"
Pop-Location
```

---

## Step 3: Deploy Infrastructure with Terraform

The `infra/` directory manages:
- GCP VPC + Subnet + Cloud NAT
- GKE Autopilot Cluster
- New Relic Dashboards and Alert Policies
- New Relic Kubernetes Integration (`nri-bundle`)
- Booking Platform Helm Chart (via `local-exec`)

```powershell
cd infra

# Initialize Terraform
terraform init

# Preview changes
terraform plan `
  -var="project_id=praneeth1211-gcp-pilot" `
  -var="newrelic_account_id=YOUR_ACCOUNT_ID" `
  -var="newrelic_api_key=YOUR_NRAK_KEY" `
  -var="newrelic_license_key=YOUR_LICENSE_KEY"

# Apply — creates the GKE cluster and deploys Helm chart
terraform apply `
  -var="project_id=praneeth1211-gcp-pilot" `
  -var="newrelic_account_id=YOUR_ACCOUNT_ID" `
  -var="newrelic_api_key=YOUR_NRAK_KEY" `
  -var="newrelic_license_key=YOUR_LICENSE_KEY"
```

> **Note:** Cluster creation takes 5–10 minutes. Helm deployment follows automatically via `local-exec`.

---

## Step 4: Verify Deployment

```powershell
# Fetch cluster credentials
gcloud container clusters get-credentials nr-gke-autopilot `
  --region us-central1 `
  --project praneeth1211-gcp-pilot

# Check all pods are running
kubectl get pods -n platform-central

# Check all deployments
kubectl get deployments -n platform-central

# Get the external IP of the API Gateway
kubectl get service api-gateway -n platform-central
```

The `api-gateway` service is a `LoadBalancer` — the EXTERNAL-IP it is assigned is your public entry point.

---

## Spring Profiles

Each service uses the **`gcp`** Spring profile when running in GKE. This is injected by the Helm chart at deployment time:

```yaml
env:
  - name: SPRING_PROFILES_ACTIVE
    value: "gcp"
  - name: EUREKA_CLIENT_SERVICEURL_DEFAULTZONE
    value: "http://discovery-server:8761/eureka"
```

To support this, each Spring Boot service must have an `application-gcp.yml` (or `application-gcp.properties`) that overrides:
- MongoDB URI (Atlas or GCP MongoDB)
- Eureka URL: `http://discovery-server:8761/eureka`

---

## New Relic Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `newrelic_account_id` | Numeric account ID | Account dropdown in New Relic |
| `newrelic_api_key` | User API Key (`NRAK-...`) | New Relic → API Keys → User |
| `newrelic_license_key` | Ingest License Key (`...NRAL`) | New Relic → API Keys → INGEST - LICENSE |

---

## Teardown

```powershell
cd infra
terraform destroy `
  -var="project_id=praneeth1211-gcp-pilot" `
  -var="newrelic_account_id=YOUR_ACCOUNT_ID" `
  -var="newrelic_api_key=YOUR_NRAK_KEY" `
  -var="newrelic_license_key=YOUR_LICENSE_KEY"
```

> ⚠️ This destroys the GKE cluster, VPC, and all Kubernetes workloads. New Relic resources (dashboards, alerts) will also be deleted.

---

## Local Development

Start all services locally using:

```powershell
cd apps
./run-all.ps1
```

Or run each service individually:

```powershell
# In separate terminals
cd apps/discovery-server  && mvn spring-boot:run
cd apps/user-service      && mvn spring-boot:run
cd apps/booking-service   && mvn spring-boot:run
cd apps/frontend          && npm install && npm start
```

Frontend is available at `http://localhost:3000`.

---

## Repository Structure

```
newrelic-integrations/
├── apps/
│   ├── booking-platform-chart/   # Unified Helm chart for all services
│   │   ├── Chart.yaml
│   │   ├── values.yaml           # Central config (profiles, ports, registry)
│   │   └── templates/            # K8s Deployment + Service per microservice
│   ├── booking-service/          # Spring Boot microservice
│   ├── user-service/
│   ├── inventory-service/
│   ├── payment-service/
│   ├── ingestion-service/
│   ├── notification-service/
│   ├── discovery-server/         # Eureka service registry
│   ├── api-gateway/              # Spring Cloud Gateway (public entry point)
│   └── frontend/                 # React frontend (Nginx)
├── infra/
│   ├── main.tf                   # GKE Autopilot cluster
│   ├── network.tf                # VPC, Subnet, Cloud NAT
│   ├── providers.tf              # GCP + New Relic providers
│   ├── variables.tf              # Input variables
│   ├── outputs.tf                # Cluster endpoint, etc.
│   ├── booking_platform_local_exec.tf  # Helm deploy via local-exec
│   ├── newrelic_alerts.tf        # Alert policy + conditions
│   └── newrelic_dashboards.tf    # GKE SRE dashboard
└── DEPLOYMENT.md                 # This file
```
