# Java APM Instrumentation Guide

This document explains how Application Performance Monitoring (APM) is implemented for the Java microservices in this project.

## 🚀 Instrumentation Strategy: Manual Agent Injection

We have implemented a **"Build-Time Injection"** strategy. Instead of relying on a Kubernetes Operator to inject the agent at runtime, we include the New Relic Java agent directly in the container image.

### Advantages of this approach:
- **Portability**: The monitoring works identically in local Docker, Minikube, and GKE.
- **Predictability**: You can verify the agent is present by simply running the container locally.
- **Zero K8s Dependency**: Monitoring isn't dependent on the cluster having specific Operators or admission webhooks installed.

---

## 🛠️ Implementation Details

### 1. Dockerfile Configuration
Every Java-based microservice includes the following logic in its `Dockerfile`:

```dockerfile
# Download the latest New Relic Java Agent
RUN apk add --no-cache wget && \
    wget -O newrelic.jar https://download.newrelic.com/newrelic/java-agent/newrelic-agent/current/newrelic.jar

# Attach the agent to the JVM at startup
ENTRYPOINT ["java", "-javaagent:/app/newrelic.jar", "-jar", "app.jar"]
```

### 2. Runtime Configuration (Environment Variables)
The agent automatically looks for specific environment variables to identify where to send data and how to name the application. These are injected via the Helm chart or `docker-compose`:

| Variable | Description |
|----------|-------------|
| `NEW_RELIC_LICENSE_KEY` | Your New Relic Ingest License Key |
| `NEW_RELIC_APP_NAME` | The name that will appear in the New Relic UI (e.g., `user-service`) |
| `NEW_RELIC_LABELS` | (Optional) Used for filtering (e.g., `Environment:Production`) |

---

## 🧪 Local Verification

To verify that APM is working without deploying to Kubernetes, you can run a container locally:

```bash
docker run -e NEW_RELIC_LICENSE_KEY=your_key \
           -e NEW_RELIC_APP_NAME=test-app \
           us-central1-docker.pkg.dev/your-project/user-service:latest
```

Check the standard output; you should see a line starting with `INFO: New Relic Agent has started`.

## 🔄 Alternative: Kubernetes Operator
While we currently use the manual injection method for maximum compatibility, New Relic also offers a **Kubernetes Operator** that can inject agents into pods without modifying Dockerfiles. If you wish to switch to that method in the future, see the [official documentation](https://docs.newrelic.com/docs/kubernetes-pixie/kubernetes-integration/advanced-configuration/kubernetes-operator-automatic-injection/).
