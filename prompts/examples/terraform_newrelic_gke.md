## 🚀 Example Usage: Terraform + Google Cloud (GKE Autopilot) + New Relic

*"Act as an expert Cloud Architect and Site Reliability Engineer (SRE). I want to learn how to expertly provision and instrument a **Google Kubernetes Engine (GKE) Autopilot cluster** and deploy **New Relic Infrastructure Monitoring** onto it using **Terraform**. Please structure my project-based learning with the following comprehensive breakdown:*

1. **Core Concepts:** *Explain the core components required to link the Google Cloud Terraform provider with the New Relic Terraform Provider, and the specifics of deploying Helm metrics on a GKE Autopilot cluster via Terraform.*
2. **Best Practices & Architecture:** *Explain the best practices for handling the New Relic API/License keys securely in Terraform (e.g., using GCP Secret Manager or variables), setting up OIDC/Workload Identity for the cluster, and module structure.*
3. **Hands-On Exercises:** *Give me 3 progressively difficult, step-by-step practical exercises:
    * **Exercise 1:** Provision a basic GKE Autopilot cluster using the official Google Terraform module.
    * **Exercise 2:** Use the `helm` Terraform provider to deploy the `newrelic-infrastructure` helm chart (nri-bundle) to the cluster.
    * **Exercise 3:** Use the `newrelic` Terraform provider to create a basic alert policy and condition (e.g., High Pod Memory Allocation) attached to the cluster.*
4. **Pitfalls & Anti-Patterns:** *What are the most common mistakes when combining Kubernetes YAML/Helm inside Terraform state, specifically regarding GKE Autopilot's resource constraints and New Relic DaemonSets?*
5. **Curated Resources:** *Recommend the definitive docs for the New Relic Helm charts, the New Relic Terraform provider registry, and GCP GKE Autopilot Terraform examples.*
6. **Structured 4-Week Mastery Plan:** *Create a week-by-week project roadmap moving from basic GCP authentication to a fully monitored GKE cluster managed entirely by automated Terraform CI/CD."*
