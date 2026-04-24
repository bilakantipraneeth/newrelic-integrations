# New Relic Java APM Deployment Guide (Distroless)

This project implements a secure, high-performance Java 17 application with New Relic APM instrumentation, running on a minimal Google Distroless base image.

## Architecture Overview

We use a **Base Image Strategy** to separate the monitoring infrastructure from the application logic.

### 1. The Base Image (`Dockerfile.base`)
- **Base**: `mcr.microsoft.com/openjdk/jdk:17-distroless`
- **Purpose**: Provides a pre-configured environment with the New Relic Java Agent.
- **Components**:
    - New Relic Agent binaries (`newrelic.jar`, `newrelic.yml`).
    - Pre-created `logs` directory.
    - Optimized environment variables (`JAVA_TOOL_OPTIONS`).

### 2. The Application Image (`Dockerfile`)
- **Base**: Starts `FROM` the New Relic Base Image.
- **Build Stage**: Uses a temporary Azure Linux image to compile the Java source code from the `app/` folder.
- **Final Stage**: Copies the resulting `app.jar` into the distroless environment.

## Deployment Steps

### Step 1: Build the New Relic Base Image
Run this command to prepare the monitoring environment:
```bash
docker build -f Dockerfile.base -t newrelic-java17-distroless .
```

### Step 2: Build the Application Image
Run this command to build your specific Java application:
```bash
docker build -t java-crud-app .
```

### Step 3: Run the Container
Pass your New Relic credentials as environment variables:
```bash
docker run -d -p 8080:8080 \
  -e NEW_RELIC_LICENSE_KEY=your_license_key_here \
  -e NEW_RELIC_APP_NAME="Java-CRUD-Service" \
  java-crud-app
```

## Testing the API

Once running, you can test the CRUD operations to generate APM data:

- **Create User**: `curl -X POST http://localhost:8080/api`
- **Read Data**: `curl http://localhost:8080/api`
- **Reset Database**: `curl -X DELETE http://localhost:8080/api`

## Security Benefits
- **Distroless**: The final image contains NO shell, NO package manager, and NO extra binaries. This drastically reduces the attack surface and eliminates almost all OS-level vulnerabilities.
- **Multi-Stage**: Build tools (like `javac`, `curl`, `unzip`) are completely removed from the final production image.

## Dashboard Verification

Once the application is running, follow these steps to see your data:

1.  **Open New Relic One**: Log in to [one.newrelic.com](https://one.newrelic.com).
2.  **Navigate to APM**: Click on **APM & Services** in the left sidebar.
3.  **Select Your App**: Look for **`Java-CRUD-App`** in the list.
4.  **Monitor Transactions**: Click on **Transactions** to see the `GET`, `POST`, and `DELETE` requests we generated.

## Understanding Agent Logs

### Adaptive Sampler
You may see logs like `Updating shared Adaptive Sampler sampling target to 120`. This is a built-in feature that automatically adjusts how many traces are collected based on your app's traffic. It ensures you get high-quality data without impacting performance.

### JFR (Java Flight Recorder)
The logs may mention `New Relic JFR Monitor is disabled`. This is normal. JFR is only needed for advanced CPU and Memory profiling. Standard APM metrics work perfectly without it.

---
**Status**: DEPLOYED AND VERIFIED
