# Backend Dockerfile
# Simple Node.js Dockerfile for production

FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose the port the app runs on
ENV PORT=3000
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
