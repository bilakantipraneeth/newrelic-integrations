# NeoBooking Platform — Technical Walkthrough

## Architecture

```
Browser (React) → API Gateway :8080 → [Eureka Discovery :8761]
                                  ├── user-service        :8081
                                  ├── booking-service     :8082
                                  ├── inventory-service   :8083
                                  ├── notification-service:8084
                                  └── payment-service     :8085
```

## Multi-Module Structure

The project is a **Maven multi-module** project. One build compiles everything:

```
apps/
├── pom.xml                   ← Parent POM (builds all modules)
├── discovery-server/         ← Eureka registry
├── api-gateway/              ← Spring Cloud Gateway
├── user-service/
├── booking-service/
├── inventory-service/        ← Auto-ingests Movies, Restaurants, Workspaces on startup
├── payment-service/          ← Handles transactions
├── notification-service/
└── frontend/                 ← React SPA
```

## How to Run (One Command)

### Windows (PowerShell):
```powershell
# From the apps/ directory
powershell -ExecutionPolicy Bypass -File run-all.ps1
```

### Skip Build (if already compiled):
```powershell
powershell -ExecutionPolicy Bypass -File run-all.ps1 -NoBuild
```

### Linux/macOS:
```bash
chmod +x run-all.sh && ./run-all.sh
```

## Data Ingestion — How It Works

The [InventoryService](file:///d:/gemini-projects/azure/ado-repos/newrelic/practical/github/newrelic-integrations/apps/inventory-service/src/main/java/com/bookingplatform/inventory/service/InventoryService.java#12-34) contains a [DataInitializer](file:///d:/gemini-projects/azure/ado-repos/newrelic/practical/github/newrelic-integrations/apps/inventory-service/src/main/java/com/bookingplatform/inventory/config/DataInitializer.java#12-44) (`CommandLineRunner`) that automatically seeds the database with categories and products on startup:

| Category      | Products                              |
|--------------|---------------------------------------|
| 🎬 Movies     | Inception, The Matrix, Interstellar   |
| 🍽️ Restaurants | Pasta Palace, Sushi Zen, Burger Barn  |
| 💻 Workspaces  | Conference Room A, Meeting Pod 1, ... |

## Admin Portal — Dynamic Ingestion

Navigate to `http://localhost:3000/admin` to:
1. Add a new **Category** (e.g., BUS for RedBus, FOOD for Swiggy)
2. **Ingest Products** under any category
3. Categories appear instantly in the **Booking Explorer**

## User Flow

1. **Dashboard** (`/`) — Live service health grid
2. **Booking Explorer** (`/bookings`) — Select category → resources load dynamically
3. **Checkout** (`/checkout`) — Review booking → Enter payment → Confirm
4. **My Orders** (`/orders`) — View transaction history and statuses

## Key Endpoints

| Service | URL |
|---------|-----|
| API Gateway | `http://localhost:8080` |
| Eureka Dashboard | `http://localhost:8761` |
| Frontend | `http://localhost:3000` |
| Inventory API | `GET /api/v1/inventory/categories` |
| Booking API | `POST /api/v1/bookings` |
| Payment API | `POST /api/v1/payments/process` |
