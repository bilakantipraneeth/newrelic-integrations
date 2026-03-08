# Build Stage
FROM node:18-alpine as build
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build React app
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/build /usr/share/nginx/html

# Map port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
