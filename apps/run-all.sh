#!/bin/bash
# NeoBooking Platform - One-Command Launcher (Linux/macOS)

APPS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "\033[35m==> Building all modules...\033[0m"
cd "$APPS_DIR" && mvn clean install -DskipTests

echo -e "\033[35m==> Stopping old Java processes...\033[0m"
pkill -f "bookingplatform" 2>/dev/null || true
sleep 2

launch_service() {
    local NAME=$1
    local JAR=$2
    local WAIT=$3
    echo -e "\033[36m==> Starting $NAME...\033[0m"
    java -jar "$APPS_DIR/$JAR" &
    sleep $WAIT
}

launch_service "Discovery Server" "discovery-server/target/discovery-server-1.0.0-SNAPSHOT.jar" 12
launch_service "API Gateway"      "api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar"           8
launch_service "User Service"     "user-service/target/user-service-1.0.0-SNAPSHOT.jar"         5
launch_service "Booking Service"  "booking-service/target/booking-service-1.0.0-SNAPSHOT.jar"   5
launch_service "Inventory Service" "inventory-service/target/inventory-service-1.0.0-SNAPSHOT.jar"   5
launch_service "Ingestion Service" "ingestion-service/target/ingestion-service-1.0.0-SNAPSHOT.jar" 5
launch_service "Payment Service"   "payment-service/target/payment-service-1.0.0-SNAPSHOT.jar"     5
launch_service "Notification Svc" "notification-service/target/notification-service-1.0.0-SNAPSHOT.jar" 5

echo -e "\033[33m==> Starting React Frontend...\033[0m"
cd "$APPS_DIR/frontend" && npm install && npm start
