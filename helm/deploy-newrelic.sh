#!/bin/bash

# Ensure a License Key is provided
if [ -z "$1" ]; then
  echo "Error: Please provide your New Relic License Key."
  echo "Usage: ./deploy-newrelic.sh <LICENSE_KEY>"
  exit 1
fi

LICENSE_KEY=$1

# Add the New Relic Helm repository
helm repo add newrelic https://helm-charts.newrelic.com
helm repo update

# Create the namespace for New Relic
kubectl create namespace newrelic --dry-run=client -o yaml | kubectl apply -f -

# Install or Upgrade the New Relic nri-bundle using the custom values-autopilot.yaml
echo "Deploying New Relic to GKE Autopilot..."
helm upgrade --install newrelic-bundle newrelic/nri-bundle \
  --namespace newrelic \
  -f values-autopilot.yaml \
  --set global.licenseKey=${LICENSE_KEY}

echo "Deployment initiated. Check pod status with: kubectl get pods -n newrelic"
