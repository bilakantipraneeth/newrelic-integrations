# APM Auto-Instrumentation Guide

This document explains how to enable automatic Application Performance Monitoring (APM) for your workloads in the GKE cluster.

## Overview
We use the **New Relic Kubernetes Operator** (which includes a cert-manager and admission webhooks) to inject APM agents into your application pods automatically. This means you do not need to modify your Dockerfiles or application code.

## 1. Prerequisites
- The `k8s-agents-operator` must be enabled in the `nri-bundle` Helm chart (already done in our setup).
- Your application must be one of the supported languages: **Java, Node.js, Python, or .NET**.

## 2. Deploy the Instrumentation Custom Resource
To tell the operator how to configure the agents, you must deploy an `Instrumentation` manifest. This defines the New Relic License Key and the collector endpoint.

### Example `instrumentation.yaml`:
```yaml
apiVersion: newrelic.com/v1beta2
kind: Instrumentation
metadata:
  name: newrelic-instrumentation
  namespace: newrelic
spec:
  agent:
    language: java
    image: newrelic/newrelic-java-init:latest
  
  # Automatically targets the 'default' namespace
  namespaceLabelSelector:
    matchExpressions:
      - key: "kubernetes.io/metadata.name"
        operator: "In"
        values: ["default"]

  # Automatically targets pods with label app.kubernetes.io/name=app1
  podLabelSelector:
    matchExpressions:
      - key: "app.kubernetes.io/name"
        operator: "In"
        values: ["app1"]
```

## 3. Enable Auto-Injection
With the provided manifest, injection is **Automatic** for any Pod in the `default` namespace that has the label `app.kubernetes.io/name: app1`.

You do not need to manually label the namespace if you use the `namespaceLabelSelector` shown above. 

## 4. GKE Autopilot Specifics
... (rest of the doc)

On Autopilot, the operator automatically ensures that the injected init-containers and sidecars respect the cluster's resource constraints. No additional configuration is required beyond the standard manifest.

## 5. Verification
After redeploying your pods, check the logs or use `kubectl describe pod` to see if the New Relic sidecar/init-containers are present. The data will appear in the **APM & Services** tab in New Relic.
