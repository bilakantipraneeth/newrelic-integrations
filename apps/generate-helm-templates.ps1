$ErrorActionPreference = "Stop"

$CHART_DIR = "d:\gemini-projects\azure\ado-repos\newrelic\practical\github\newrelic-integrations\apps\booking-platform-chart"
$TEMPLATES_DIR = "$CHART_DIR\templates"

# Create templates directory
New-Item -ItemType Directory -Force -Path $TEMPLATES_DIR | Out-Null

$SERVICES = @(
    @{ Name = "api-gateway"; ValueKey = "apiGateway" },
    @{ Name = "discovery-server"; ValueKey = "discoveryServer" },
    @{ Name = "user-service"; ValueKey = "userService" },
    @{ Name = "booking-service"; ValueKey = "bookingService" },
    @{ Name = "inventory-service"; ValueKey = "inventoryService" },
    @{ Name = "payment-service"; ValueKey = "paymentService" },
    @{ Name = "ingestion-service"; ValueKey = "ingestionService" },
    @{ Name = "notification-service"; ValueKey = "notificationService" }
)

foreach ($service in $SERVICES) {
    $name = $service.Name
    $val = $service.ValueKey
    
    $yaml = @"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $name
  labels:
    app: $name
spec:
  replicas: 1
  selector:
    matchLabels:
      app: $name
  template:
    metadata:
      labels:
        app: $name
    spec:
      containers:
        - name: $name
          image: "{{ .Values.registry }}/$name:{{ .Values.tag }}"
          imagePullPolicy: Always
          ports:
            - containerPort: {{ .Values.$val.port }}
          env:
            - name: NEW_RELIC_LICENSE_KEY
              value: {{ .Values.global.apm.licenseKey | quote }}
            - name: NEW_RELIC_APP_NAME
              value: "$name"
---
apiVersion: v1
kind: Service
metadata:
  name: $name
spec:
  selector:
    app: $name
  ports:
    - protocol: TCP
      port: {{ .Values.$val.port }}
      targetPort: {{ .Values.$val.port }}
"@

    $filePath = "$TEMPLATES_DIR\$name.yaml"
    Set-Content -Path $filePath -Value $yaml
    Write-Host "Created $filePath"
}

# Frontend is slightly different (no javaagent env vars needed)
$frontendYaml = @"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: "{{ .Values.registry }}/frontend:{{ .Values.tag }}"
          imagePullPolicy: Always
          ports:
            - containerPort: {{ .Values.frontend.port }}
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: LoadBalancer
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: {{ .Values.frontend.port }}
      targetPort: {{ .Values.frontend.port }}
"@
Set-Content -Path "$TEMPLATES_DIR\frontend.yaml" -Value $frontendYaml
Write-Host "Created $TEMPLATES_DIR\frontend.yaml"

Write-Host "Helm templates generated successfully!" -ForegroundColor Green
