# Multi-stage Dockerfile for Vite + React (production)
# Builds the app using Node and serves with nginx

# ----- Build stage -----
FROM node:18-alpine AS builder

WORKDIR /app

# Install build deps
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build the production bundle
RUN npm run build

# ----- Production stage -----
FROM nginx:stable-alpine

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
