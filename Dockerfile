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
ENV MYSQL_PUBLIC_URL=mysql://root:UZXvQgetqzklDuinMGdWkpHiOHUoZESF@gondola.proxy.rlwy.net:12442/railway
ENV DB_HOST=gondola.proxy.rlwy.net
ENV DB_PORT=12442
ENV DB_USER=root
ENV DB_PASSWORD=UZXvQgetqzklDuinMGdWkpHiOHUoZESF
ENV DB_NAME=railway
ENV DB_SSL=true

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the server
CMD ["node", "src/server.js"]
