# Stage 1: Application Builder
FROM mcr.microsoft.com/openjdk/jdk:17-azurelinux AS app-builder
WORKDIR /tmp
COPY app/Main.java .
RUN javac Main.java && \
    jar cfe app.jar Main Main.class

# Stage 2: Final Application Image
# We use our custom New Relic base image
FROM newrelic-java17-distroless

# Copy the built application from the app-builder stage
COPY --from=app-builder /tmp/app.jar /app.jar

# (Optional) Add your application-specific configurations here
LABEL application="CRUD-Test-App"

# Run the application
CMD ["-jar", "/app.jar"]