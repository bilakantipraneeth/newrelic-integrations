resource "newrelic_alert_policy" "gke_policy" {
  name                = "GKE Autopilot Health Policy"
  incident_preference = "PER_POLICY"
}

# 1. Alert for High Pod Restart Rate
resource "newrelic_nrql_alert_condition" "high_pod_restarts" {
  policy_id                    = newrelic_alert_policy.gke_policy.id
  type                         = "static"
  name                         = "High Pod Restart Rate"
  description                  = "Alert when pod restarts exceed threshold"
  enabled                      = true
  violation_time_limit_seconds = 3600

  nrql {
    query = "SELECT count(restartCount) FROM K8sPodSample WHERE clusterName = '${var.cluster_name}' AND restartCount > 0"
  }

  critical {
    operator              = "above"
    threshold             = 5
    threshold_duration    = 300
    threshold_occurrences = "ALL"
  }
}

# 2. Alert for Container Memory Usage > 90%
resource "newrelic_nrql_alert_condition" "high_memory_usage" {
  policy_id                    = newrelic_alert_policy.gke_policy.id
  type                         = "static"
  name                         = "GKE Container High Memory Usage"
  description                  = "Alert when container memory usage exceeds 90%"
  enabled                      = true
  violation_time_limit_seconds = 3600

  nrql {
    query = "SELECT average(memoryWorkingSetUtilization) FROM K8sContainerSample WHERE clusterName = '${var.cluster_name}'"
  }

  critical {
    operator              = "above"
    threshold             = 90
    threshold_duration    = 300
    threshold_occurrences = "ALL"
  }
}
