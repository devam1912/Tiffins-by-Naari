# Use Node.js 18-alpine for a small footprint
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files from the Backend directory context
COPY Backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend source code
COPY Backend/ ./

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
