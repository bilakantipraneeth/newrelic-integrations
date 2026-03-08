<#
.SYNOPSIS
  NeoBooking Platform - One-Command Launcher
  Runs: mvn clean install, then starts all 7 Java services + React frontend.

.USAGE
  From the `apps` directory:
    powershell -ExecutionPolicy Bypass -File run-all.ps1

  To rebuild and start:
    powershell -ExecutionPolicy Bypass -File run-all.ps1 -Build

  To skip build (if already built):
    powershell -ExecutionPolicy Bypass -File run-all.ps1 -NoBuild
#>

param(
    [switch]$NoBuild
)

$AppsDir = $PSScriptRoot

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-WARN($msg) { Write-Host "    [!!] $msg" -ForegroundColor Yellow }

Write-Host @"

  _   _            ____              _    _             
 | \ | | ___  ___ | __ )  ___   ___ | | _(_)_ __   __ _ 
 |  \| |/ _ \/ _ \|  _ \ / _ \ / _ \| |/ / | '_ \ / _  |
 | |\  |  __/ (_) | |_) | (_) | (_) |   <| | | | | (_| |
 |_| \_|\___|\___/|____/ \___/ \___/|_|\_\_|_| |_|\__, |
                                                   |___/ 
    Dynamic Booking Platform - Startup Launcher v2.0
"@ -ForegroundColor Magenta

# --- 1. Build ---
if (-not $NoBuild) {
    Write-Step "Building all modules (mvn clean install -DskipTests)..."
    Push-Location $AppsDir
    mvn clean install -DskipTests
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n[FATAL] Build failed! Fix errors and retry." -ForegroundColor Red
        exit 1
    }
    Pop-Location
    Write-OK "Build successful."
}

# --- 2. Kill old Java processes ---
Write-Step "Stopping any existing Java processes..."
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# --- 3. Service definitions: Name, JAR path, Port ---
$Services = @(
    @{ Name = "User Service";     Jar = "user-service/target/user-service-1.0.0-SNAPSHOT.jar";         Port = 8081; WaitSecs = 5  },
    @{ Name = "Booking Service";  Jar = "booking-service/target/booking-service-1.0.0-SNAPSHOT.jar";   Port = 8082; WaitSecs = 5  },
    @{ Name = "Inventory Service";Jar = "inventory-service/target/inventory-service-1.0.0-SNAPSHOT.jar";Port = 8083; WaitSecs = 5  },
    @{ Name = "Payment Service";  Jar = "payment-service/target/payment-service-1.0.0-SNAPSHOT.jar";   Port = 8085; WaitSecs = 5  },
    @{ Name = "Notification Svc"; Jar = "notification-service/target/notification-service-1.0.0-SNAPSHOT.jar"; Port = 8084; WaitSecs = 5  },
    @{ Name = "Ingestion Svc";    Jar = "ingestion-service/target/ingestion-service-1.0.0-SNAPSHOT.jar";   Port = 8086; WaitSecs = 5  }
)

# --- 4. Launch each service ---
foreach ($svc in $Services) {
    Write-Step "Starting $($svc.Name) on port $($svc.Port)..."
    $fullJar = Join-Path $AppsDir $svc.Jar
    Start-Process -FilePath "java" -ArgumentList "-jar `"$fullJar`"" -NoNewWindow -PassThru | Out-Null
    Write-OK "$($svc.Name) launched. Waiting $($svc.WaitSecs)s for startup..."
    Start-Sleep -Seconds $svc.WaitSecs
}

# --- 5. Start Frontend ---
Write-Step "Starting React Frontend..."
$frontendDir = Join-Path $AppsDir "frontend"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; npm install; npm start" -NoNewWindow

Write-Host @"

  ===================================================
   🚀 Platform is running! Open your browser:
   
   Frontend:         http://localhost:3000
   Dashboard:        http://localhost:3000
   Booking Explorer: http://localhost:3000/bookings
   Admin Console:    http://localhost:3000/admin
   My Orders:        http://localhost:3000/orders
   Eureka Dashboard: http://localhost:8761
   
   Services: 7 microservices registered
  ===================================================
"@ -ForegroundColor Green
