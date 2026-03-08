FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Download New Relic Java Agent
RUN apk add --no-cache wget && \
    wget -O newrelic.jar https://download.newrelic.com/newrelic/java-agent/newrelic-agent/current/newrelic.jar

# Copy the built jar file
COPY target/*.jar app.jar

# Run the application with the New Relic agent attached
ENTRYPOINT ["java", "-javaagent:/app/newrelic.jar", "-jar", "app.jar"]
