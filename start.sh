#!/bin/sh
set -e

echo "============================================"
echo "  Tiffins-by-Naari — Starting all services"
echo "============================================"
echo "PORT=${PORT:-5000}"

# ── 1. Start Python Recommendation Service (background) ──
# Use absolute paths to avoid any directory confusion
echo "[BG] Starting Python Recommendation Service on port 8000..."
/app/venv/bin/uvicorn main:app \
  --app-dir /app/Python-Recommendation-Service \
  --host 127.0.0.1 \
  --port 8000 \
  --workers 1 &
PYTHON_PID=$!
echo "[BG] Python service PID: $PYTHON_PID"

# ── 2. Start Node.js Backend (foreground) ──
# This MUST bind quickly so Render's health check passes.
echo "[FG] Starting Node.js Backend on port ${PORT:-5000}..."
exec node /app/Backend/src/production.js
