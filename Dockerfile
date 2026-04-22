# ╔══════════════════════════════════════════════════════════════════╗
# ║  Tiffins-by-Naari — Unified Production Dockerfile              ║
# ║  Services: React Frontend + Express Backend + FastAPI (Python)  ║
# ║  Single container, single port (5000)                           ║
# ╚══════════════════════════════════════════════════════════════════╝

# ─────────────────────────────────────────────────────────────────
# Stage 1: Build the React Frontend
# Uses a lightweight Alpine image, discarded after build
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /build

# Copy only package files first → cache npm install layer
COPY Frontend/package.json Frontend/package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY Frontend/ ./
RUN npm run build
# Output: /build/dist


# ─────────────────────────────────────────────────────────────────
# Stage 2: Install Backend Node.js dependencies
# Separate stage so source code changes don't re-install deps
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS backend-deps

WORKDIR /deps

COPY Backend/package.json Backend/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts


# ─────────────────────────────────────────────────────────────────
# Stage 3: Production Runtime
# Node 20 (slim) + Python 3 — everything runs here
# ─────────────────────────────────────────────────────────────────
FROM node:20-slim AS production

# Labels
LABEL maintainer="Tiffins-by-Naari"
LABEL description="Unified container: React + Express + FastAPI"

# Install Python 3 + pip + wget (for health checks) in one layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        python3-venv \
        wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Python dependencies (cached unless requirements.txt changes) ──
COPY Python-Recommendation-Service/requirements.txt /tmp/requirements.txt
RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /app/venv/bin/pip install --no-cache-dir -r /tmp/requirements.txt && \
    rm /tmp/requirements.txt

# ── Backend: copy pre-installed node_modules from Stage 2 ──
COPY --from=backend-deps /deps/node_modules ./Backend/node_modules

# ── Backend: copy source code ──
COPY Backend/package.json Backend/package-lock.json ./Backend/
COPY Backend/src ./Backend/src

# ── Python service: copy source code ──
COPY Python-Recommendation-Service/main.py ./Python-Recommendation-Service/main.py

# ── Frontend: copy built static assets from Stage 1 ──
COPY --from=frontend-build /build/dist ./Frontend/dist

# ── Startup script ──
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# ── Install axios in backend (used by recommendation controller) ──
RUN cd /app/Backend && npm install --save axios 2>/dev/null || true

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser -d /app appuser && \
    chown -R appuser:appuser /app
USER appuser

# Only port 5000 is needed externally
# (Python service runs on 127.0.0.1:8000, internal only)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
    CMD wget -q --spider http://localhost:5000/api/health || exit 1

# Start all services
CMD ["./start.sh"]
