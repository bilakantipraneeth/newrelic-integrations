# Platform Central V2: Next-Level Roadmap

This roadmap outlines the evolution of **Platform Central** from a stabilized microservices mesh to an enterprise-grade, resilient, and intelligent ecosystem.

---

## 🚀 Phase 1: Intelligent Observability (Real-Time)

Currently, the "Telemetry Lab" uses high-fidelity simulations. In V2, we will bridge this to live production data.

### 📊 Live New Relic Integration
- **Distributed Tracing**: Implement OpenTelemetry headers to track a request from the React UI through to the MongoDB/H2 databases.
- **Synthetics**: Set up automated "Golden Path" monitors to alert if the `/checkout` flow latency exceeds 200ms.
- **Custom Dashboards**: Replace simulated UI charts with real-time NRQL (New Relic Query Language) data streams.

---

## 🏗️ Phase 2: Resilience & Scale

Transition the platform to handle massive concurrent traffic and "noisy neighbors."

### 🛡️ Resilience Patterns
- **Circuit Breakers**: Implement Resilience4j on the Booking Service to prevent cascading failures if the Payment node slows down.
- **Redis Caching**: Cache the "Asset Marketplace" catalog in Redis to reduce the load on MongoDB and provide <10ms response times for users.
- **Rate Limiting**: Protect the Ingest API against bot traffic using Spring Security and Bucket4j.

### 🏗️ Platform Central: Architecture & Design
- **Dockerization**: Create Dockerfile configuration for all 6 microservices and the frontend, standardizing the build and run environments.
- **APM Integration**: Embed the **New Relic APM Java Agent** directly into the backend Dockerfiles to automatically scrape telemetry data, errors, and distributed traces as soon as the container spins up.
- **Helm Orchestration**: Create a unified Helm chart (`booking-platform-chart`) to manage the deployments, services, and configuration routing for all 9 components simultaneously.
- **Infrastructure as Code (Terraform)**: Utilize the Terraform `helm_release` resource to programmatically deploy the platform to GKE, dynamically injecting the `NEW_RELIC_LICENSE_KEY` into the pods at runtime for secure telemetry.

---

## ✨ Phase 3: Advanced User Engagement

Enhance the "WOW" factor with real-time interactivity.

### 🔔 Real-Time Signaling
- **WebSockets**: Implement Socket.io for live "Asset Sold Out" notifications and real-time ledger updates across all open dashboards.
- **Dynamic Pricing**: Use a lightweight rule engine to adjust valuation based on asset popularity and remaining inventory.

### 🎨 UI/UX Evolution
- **Theme Engine**: Support user-defined color themes (Carbon, Neon, Minimalism) with LocalStorage persistence.
- **Visual Mapping**: Integrate Mapbox/Leaflet to show physical locations for Workspaces and Restaurants.

---

## 🛠️ Operational Excellence (DevOps)

- **CI/CD Pipelines**: Automated GitHub Actions to build, test, and scan JARs/Images on every PR.
- **Infrastructure as Code (IaC)**: Use Terraform to spin up the MongoDB Atlas and Cloud infra automatically.
- **Automated E2E**: Comprehensive Playwright test suite running in headless mode for every deployment.

---

## 📈 Summary of Next Steps
1.  **Phase 2 Activation**: Create Dockerfiles for all microservices (User, Booking, Inventory, Payment, Ingestion, Notification) and the React Frontend.
2.  **Telemetry Injection**: Inject the New Relic Java Agent (`newrelic.jar`) into the backend microservice Dockerfiles.
3.  **Local Orchestration**: Implement Docker Compose for one-click local orchestration.
4.  **Week 3**: Enable Redis Caching for the Ingestion Service.
