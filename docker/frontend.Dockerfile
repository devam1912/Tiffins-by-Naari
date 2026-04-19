# --- Stage 1: Build the React App ---
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files from the Frontend directory context
COPY Frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY Frontend/ ./

# Define build argument for the backend URL
# This ensures Vite can embed the correct API URL during the build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# --- Stage 2: Serve the App with Nginx ---
FROM nginx:alpine

# Copy custom Nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
