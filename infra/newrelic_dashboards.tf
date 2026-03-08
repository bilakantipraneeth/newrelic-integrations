resource "newrelic_one_dashboard" "gke_dashboard" {
  name        = "GKE Autopilot - SRE Overview"
  permissions = "public_read_write"

  page {
    name = "Cluster Health"

    # CPU Usage Widget
    widget_billboard {
      title  = "Cluster CPU Usage (%)"
      row    = 1
      column = 1
      width  = 4
      height = 3

      nrql_query {
        query = "SELECT average(cpuLimitUtilization) FROM K8sContainerSample WHERE clusterName = '${var.cluster_name}'"
      }
    }

    # Memory Usage Widget
    widget_billboard {
      title  = "Cluster Memory Usage (%)"
      row    = 1
      column = 5
      width  = 4
      height = 3

      nrql_query {
        query = "SELECT average(memoryWorkingSetUtilization) FROM K8sContainerSample WHERE clusterName = '${var.cluster_name}'"
      }
    }

    # Pod Status Count
    widget_pie {
      title  = "Pods by Status"
      row    = 1
      column = 9
      width  = 4
      height = 3

      nrql_query {
        query = "SELECT count(*) FROM K8sPodSample WHERE clusterName = '${var.cluster_name}' FACET status"
      }
    }

    # Recent Log Entries
    widget_log_table {
      title  = "Critical Error Logs"
      row    = 4
      column = 1
      width  = 12
      height = 3

      nrql_query {
        query = "SELECT message FROM Log WHERE cluster_name = '${var.cluster_name}' AND level = 'error' LIMIT 10"
      }
    }
  }
}
