resource "null_resource" "booking_platform_deploy" {
  # This ensures the Helm deploy only runs AFTER the GKE cluster is fully provisioned
  depends_on = [google_container_cluster.autopilot_cluster]

  # Trigger a re-run if the values file or license key changes
  triggers = {
    license_key   = var.newrelic_license_key
    values_sha    = filebase64sha256("${path.module}/../apps/booking-platform-chart/values.yaml")
    cluster_name  = google_container_cluster.autopilot_cluster.name
    project_id    = var.project_id
    region        = var.region
  }

  provisioner "local-exec" {
    # Using the local-exec provisioner explicitly with PowerShell to deploy the custom Helm chart
    interpreter = ["PowerShell", "-Command"]
    command     = <<EOT
      gcloud container clusters get-credentials ${google_container_cluster.autopilot_cluster.name} --region ${var.region} --project ${var.project_id}; 
      kubectl create namespace platform-central --dry-run=client -o yaml | kubectl apply -f -; 
      helm upgrade --install booking-platform ${path.module}/../apps/booking-platform-chart --namespace platform-central --set global.apm.licenseKey=${var.newrelic_license_key}
    EOT
  }

  provisioner "local-exec" {
    when = destroy
    # Using the local-exec provisioner explicitly with PowerShell for cleanup
    interpreter = ["PowerShell", "-Command"]
    command     = <<EOT
      $ErrorActionPreference = "Continue";
      # Fallback to hardcoded values or use self.triggers if available at destroy time
      $clusterName = "${self.triggers.cluster_name}";
      $region = "${self.triggers.region}";
      $projectId = "${self.triggers.project_id}";
      gcloud container clusters get-credentials $clusterName --region $region --project $projectId; 
      helm uninstall booking-platform --namespace platform-central;
      kubectl delete namespace platform-central
    EOT
  }
}
