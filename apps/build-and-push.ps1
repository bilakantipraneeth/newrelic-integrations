$ErrorActionPreference = "Stop"

$PROJECT_ID = "praneeth1211-gcp-pilot"
$REGION = "us-central1"
$REPO = "newrelic-platform"
$REGISTRY = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO"
$VERSION = "latest"

$SERVICES = @(
    "api-gateway", 
    "discovery-server", 
    "user-service", 
    "booking-service", 
    "inventory-service", 
    "payment-service", 
    "ingestion-service", 
    "notification-service", 
    "frontend"
)

Write-Host "Configuring Docker auth for GCP..." -ForegroundColor Cyan
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

foreach ($service in $SERVICES) {
    Write-Host "`n=======================================================" -ForegroundColor Cyan
    Write-Host "Building and pushing $service..." -ForegroundColor Cyan
    Write-Host "=======================================================" -ForegroundColor Cyan
    
    $IMAGE_NAME = "$REGISTRY/${service}:$VERSION"
    
    Push-Location $service
    
    Write-Host "-> Building $IMAGE_NAME" -ForegroundColor Yellow
    docker build -t $IMAGE_NAME .
    
    Write-Host "-> Pushing $IMAGE_NAME" -ForegroundColor Yellow
    docker push $IMAGE_NAME
    
    Pop-Location
}

Write-Host "`nAll 9 services successfully built and pushed to Artifact Registry!" -ForegroundColor Green
