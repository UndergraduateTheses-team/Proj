# Use a minimal Node.js image
FROM node:20-alpine3.20

# Accept build-time arguments
ARG MONGODB_URI
ARG SERVER_UPLOAD_URL
ARG GITHUB_SHA
ARG GITHUB_REF

# Set environment variables
ENV MONGODB_URI=$MONGODB_URI
ENV SERVER_UPLOAD_URL=$SERVER_UPLOAD_URL
ENV GITHUB_SHA=$GITHUB_SHA
ENV GITHUB_REF=$GITHUB_REF

# Create and set the working directory
WORKDIR /app

# Copy only dependency files first for better caching
COPY Server/package*.json ./

# Install dependencies
RUN npm ci

# Copy the full backend source code
COPY API-Server/ .

# Expose the app port (change if not 3000)
EXPOSE 3000

# Start the backend
CMD ["npm", "start"]
