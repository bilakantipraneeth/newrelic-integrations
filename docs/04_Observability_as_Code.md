# Observability as Code: Alerts & Dashboards

This phase implements monitoring logic directly in Terraform.

## Implemented Features
1. **New Relic Terraform Provider:** Configured in `providers.tf` to interact with the New Relic Graph API.
2. **Alert Policies (`newrelic_alerts.tf`):**
    - **High Pod Restart Rate:** Triggers if any pod restarts more than 5 times in 5 minutes.
    - **Container Memory Usage:** Triggers if memory usage exceeds 90% utilization.
3. **SRE Dashboard (`newrelic_dashboards.tf`):**
    - Billboard widgets for Cluster CPU and Memory.
    - Pie chart for Pod Status distribution.
    - Log table for Critical Error filtering.

## Configuration Requirements
The following variables must be provided for `terraform apply`:
- `newrelic_account_id`: Your numeric Account ID.
- `newrelic_api_key`: Your User (Personal) API Key.

