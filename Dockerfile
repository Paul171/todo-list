# Use Node.js 20 as the base image
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install backend dependencies
RUN npm ci

# Copy client package files
COPY client/package*.json ./client/

# Install frontend dependencies
WORKDIR /app/client
RUN npm ci

# Copy all project files
WORKDIR /app
COPY . .

# Build the frontend application
WORKDIR /app/client
RUN npm run build

# Clean up development dependencies to make the image smaller
WORKDIR /app
RUN npm ci --omit=dev

# Expose the port the server runs on
EXPOSE 3000

# Set environment variables with defaults
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_HOST=localhost
ENV DB_USER=root
ENV DB_PASSWORD=password
ENV DB_NAME=todolist

# Start the server
CMD ["node", "src/server.js"]
