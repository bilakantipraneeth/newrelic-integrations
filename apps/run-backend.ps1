# Specialized backend launcher
$AppsDir = $PSScriptRoot

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "    [OK] $msg" -ForegroundColor Green }

# Service definitions from run-all.ps1
$Services = @(
    @{ Name = "Discovery Server"; Jar = "discovery-server/target/discovery-server-1.0.0-SNAPSHOT.jar"; Port = 8761; WaitSecs = 12 },
    @{ Name = "API Gateway";      Jar = "api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar";           Port = 8080; WaitSecs = 8  },
    @{ Name = "User Service";     Jar = "user-service/target/user-service-1.0.0-SNAPSHOT.jar";         Port = 8081; WaitSecs = 5  },
    @{ Name = "Booking Service";  Jar = "booking-service/target/booking-service-1.0.0-SNAPSHOT.jar";   Port = 8082; WaitSecs = 5  },
    @{ Name = "Inventory Service";Jar = "inventory-service/target/inventory-service-1.0.0-SNAPSHOT.jar";Port = 8083; WaitSecs = 5  },
    @{ Name = "Payment Service";  Jar = "payment-service/target/payment-service-1.0.0-SNAPSHOT.jar";   Port = 8085; WaitSecs = 5  },
    @{ Name = "Notification Svc"; Jar = "notification-service/target/notification-service-1.0.0-SNAPSHOT.jar"; Port = 8084; WaitSecs = 5  },
    @{ Name = "Ingestion Svc";    Jar = "ingestion-service/target/ingestion-service-1.0.0-SNAPSHOT.jar";   Port = 8086; WaitSecs = 5  }
)

foreach ($svc in $Services) {
    Write-Step "Starting $($svc.Name) on port $($svc.Port)..."
    $fullJar = Join-Path $AppsDir $svc.Jar
    # Run in background and redirect output to log file to keep current terminal clean
    $outLog = Join-Path $AppsDir "$($svc.Name.Replace(' ', '_').ToLower())_out.log"
    $errLog = Join-Path $AppsDir "$($svc.Name.Replace(' ', '_').ToLower())_err.log"
    Start-Process -FilePath "java" -ArgumentList "-jar `"$fullJar`"" -RedirectStandardOutput $outLog -RedirectStandardError $errLog -NoNewWindow
    Write-OK "$($svc.Name) launched. Waiting $($svc.WaitSecs)s..."
    Start-Sleep -Seconds $svc.WaitSecs
}

Write-Host "`nAll backend services launched!" -ForegroundColor Green
