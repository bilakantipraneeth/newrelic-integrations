resource "null_resource" "newrelic_k8s_integration" {
  # This ensures the integration is only installed AFTER the GKE cluster is ready
  depends_on = [google_container_cluster.autopilot_cluster]

  # Trigger a re-run if the license key or cluster name changes
  triggers = {
    license_key  = var.newrelic_license_key
    cluster_name = google_container_cluster.autopilot_cluster.name
  }

  provisioner "local-exec" {
    # Using the local-exec provisioner with PowerShell to install the nri-bundle
    interpreter = ["PowerShell", "-Command"]
    command     = <<EOT
      helm repo add newrelic https://helm-charts.newrelic.com;
      helm repo update;
      helm upgrade --install newrelic-bundle newrelic/nri-bundle `
        --namespace newrelic `
        --create-namespace `
        --set global.licenseKey=${var.newrelic_license_key} `
        --set global.cluster=${var.cluster_name} `
        --set newrelic-infrastructure.enabled=true `
        --set kubeEvents.enabled=true `
        --set logging.enabled=true `
        --set ksps.enabled=true
    EOT
  }

  provisioner "local-exec" {
    when = destroy
    interpreter = ["PowerShell", "-Command"]
    command     = <<EOT
      $ErrorActionPreference = "Continue";
      # Fetch credentials for the cluster from triggers (available during destroy)
      gcloud container clusters get-credentials ${self.triggers.cluster_name} --region us-central1 --project praneeth1211-gcp-pilot;
      helm uninstall newrelic-bundle --namespace newrelic;
      kubectl delete namespace newrelic
    EOT
  }
}
