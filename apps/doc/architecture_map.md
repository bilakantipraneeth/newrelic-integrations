# Platform Central: Architecture & Integration Map

This document outlines the distributed microservices architecture of **Platform Central**, detailing service roles, communication ports, and the frontend-to-backend orchestration flow.

## 🏗️ System Overview

The platform is built on a **Decentralized Service Mesh** architecture where the Frontend acts as the primary orchestrator, communicating directly with specialized microservices.

```mermaid
graph TD
    subgraph "Client Layer"
        ReactApp["React Frontend (Port 3000)"]
    end

    subgraph "Intelligence Layer"
        IngestionSvc["Ingestion Service (Port 8086)"]
        Mongo[(MongoDB Catalog)]
    end

    subgraph "Core Business Layer"
        BookingSvc["Booking Service (Port 8082)"]
        PaymentSvc["Payment Service (Port 8085)"]
        H2_Booking[(H2 Booking DB)]
        H2_Payment[(H2 Transaction DB)]
    end

    subgraph "Support Layer"
        UserSvc["User Service (Port 8081)"]
        NotifySvc["Notification Service (Port 8084)"]
        InventorySvc["Inventory Service (Port 8083)"]
    end

    ReactApp -->|Fetch Catalog| IngestionSvc
    ReactApp -->|Process Booking| BookingSvc
    ReactApp -->|Process Payment| PaymentSvc
    IngestionSvc --> Mongo
    BookingSvc --> H2_Booking
    PaymentSvc --> H2_Payment
```

---

## 📋 Service Catalog

| Service Name | Port | Database | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **Ingestion Service** | `8086` | MongoDB (Cloud) | Asset marketplace catalog, product types, and search. |
| **Booking Service** | `8082` | H2 (InMemory) | Reservation lifecycle, status management (PENDING, CONFIRMED). |
| **Payment Service** | `8085` | H2 (InMemory) | Transaction ledger, payment processing, revenue tracking. |
| **User Service** | `8081` | H2 (InMemory) | User profiles, identity management, and security context. |
| **Notification Service** | `8084` | - | Alerting logic, email templates, and system signals. |
| **Inventory Service** | `8083` | H2 (InMemory) | Legacy inventory tracking (Maintenance Mode). |

---

## 🔄 Interaction Flow (Where Services are Used)

### 1. Asset Discovery & Marketplace
- **Location**: `Asset Marketplace` (Frontend: `/bookings`)
- **Interaction**: Frontend uses `ingestionService.js` to call `8086/api/v1/products`.
- **Purpose**: Retrieves live movie listings, restaurant tables, and workspaces.

### 2. Transaction Flow (Checkout)
- **Location**: `Checkout Flow` (Frontend: `/checkout`)
- **Interaction**:
    1.  **Booking**: Calls `bookingService.js` -> `8082/api/v1/bookings` to reserve an asset.
    2.  **Payment**: Calls `bookingService.js` -> `8085/api/v1/payments/process` to settle the amount.
- **Outcome**: A bridge is formed between the Booking (Asset) and the Ledger (Payment).

### 3. Administrative Resource Management
- **Location**: `Platform Administration` (Frontend: `/admin`)
- **Interaction**: Frontend calls `ingestionService.js` -> `8086/api/v1/categories` and `/products`.
- **Purpose**: Used for listing new assets, decommissioning items, and managing the global category registry.

### 4. System Intelligence (Monitoring)
- **Location**: `Telemetry Lab` (Frontend: `/telemetry`)
- **Interaction**: Collates simulated and live health checks across the service mesh.

---

## 🛠️ Developer Reference

- **Frontend Tech**: React, CSS Grid (Enterprise-grade), Axios.
- **Backend Tech**: Spring Boot 3.x, Spring Data JPA/MongoDB, H2/Altas.
- **CORS Policy**: All backend services are open (`@CrossOrigin("*")`) for local direct communication.
