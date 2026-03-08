# 🏗️ Booking Application Platform: Architecture & Design

## Modern Architecture Overview
The platform has evolved from a legacy Gateway/Eureka pattern to a **Decentralized Service Mesh**. This shift provides superior performance, high contrast UI alignment, and direct service-to-service orchestration via the frontend.

### Core Components
- **Unified Frontend**: React-based Command Center orchestrating all microservices.
- **Standalone Microservices**: Specialized nodes for Ingestion, Booking, Payment, User, and Notification.
- **Dynamic Ingestion**: MongoDB-backed catalog system for real-time asset marketplace updates.

---

## 📘 Comprehensive Documentation
For a detailed map of ports, interaction flows, and system diagrams, please refer to the primary documentation:

👉 **[Architecture & Integration Map](file:///d:/gemini-projects/azure/ado-repos/newrelic/practical/github/newrelic-integrations/apps/doc/architecture_map.md)**

---

## 🔬 Observability Plan
- **Distributed Tracing**: All services are instrumented for New Relic monitoring.
- **Live Telemetry Labs**: A dedicated monitoring tab in the UI provides real-time visibility into the decentralized mesh.
