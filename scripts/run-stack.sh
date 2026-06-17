#!/usr/bin/env bash
# ----------------------------------------------------------------------
# run-stack.sh – launch the full FlowTab development stack with Podman
# ----------------------------------------------------------------------
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ----------------------------------------------------------------------
# 0  Cleanup any existing containers with reserved names
# ----------------------------------------------------------------------
for container in postgres redis queue-service analytics-service web; do
  if podman ps -a --format '{{.Names}}' | grep -q "^flowtab-${container}$"; then
    echo "Removing existing container 'flowtab-${container}'..."
    podman rm -f "flowtab-${container}" >/dev/null
  fi
done

echo "Creating persistent volume 'pg_data'..."
podman volume create pg_data >/dev/null 2>&1 || true

# ----------------------------------------------------------------------
# 1  Run PostgreSQL
# ----------------------------------------------------------------------
echo "Starting PostgreSQL..."
podman run -d \
  --name flowtab-postgres \
  --restart unless-stopped \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=example \
  -e POSTGRES_DB=flowtab \
  -p 5432:5432 \
  -v pg_data:/var/lib/postgresql/data \
  docker.io/library/postgres:15-alpine

# ----------------------------------------------------------------------
# 2  Run Redis
# ----------------------------------------------------------------------
echo "Starting Redis..."
podman run -d \
  --name flowtab-redis \
  --restart unless-stopped \
  -p 6379:6379 \
  docker.io/library/redis:7-alpine \
  redis-server --appendonly yes

# ----------------------------------------------------------------------
# 3  Queue Service (FOH)
# ----------------------------------------------------------------------
echo "Building and starting queue-service..."
if [ ! -d "${PROJECT_ROOT}/services/queue-service/node_modules" ]; then
  echo "Installing queue-service dependencies..."
  npm --prefix "${PROJECT_ROOT}/services/queue-service" install >/dev/null
fi

podman run -d \
  --name flowtab-queue-service \
  --restart unless-stopped \
  -p 3000:3000 \
  -v "${PROJECT_ROOT}/services/queue-service:/app:rw,Z" \
  -e NODE_ENV=development \
  -e DATABASE_URL="postgres://postgres:example@postgres:5432/flowtab" \
  -e JWT_SECRET="supersecret" \
  --userns=keep-id \
  --workdir /app \
  --net host \
  docker.io/library/node:20-alpine npm run dev

# ----------------------------------------------------------------------
# 4  Analytics Service (BOH)
# ----------------------------------------------------------------------
echo "Building and starting analytics-service..."
if [ ! -d "${PROJECT_ROOT}/services/analytics-service/node_modules" ]; then
  echo "Installing analytics-service dependencies..."
  npm --prefix "${PROJECT_ROOT}/services/analytics-service" install >/dev/null
fi

podman run -d \
  --name flowtab-analytics-service \
  --restart unless-stopped \
  -p 3001:3001 \
  -v "${PROJECT_ROOT}/services/analytics-service:/app:rw,Z" \
  -e NODE_ENV=development \
  -e DATABASE_URL="postgres://postgres:example@postgres:5432/flowtab" \
  -e JWT_SECRET="supersecret" \
  --userns=keep-id \
  --workdir /app \
  --net host \
  docker.io/library/node:20-alpine npm run dev

# ----------------------------------------------------------------------
# 5  Web Frontend
# ----------------------------------------------------------------------
echo "Starting web frontend..."
if [ ! -d "${PROJECT_ROOT}/apps/web/node_modules" ]; then
  echo "Installing web dependencies..."
  npm --prefix "${PROJECT_ROOT}/apps/web" install >/dev/null
fi

podman run -d \
  --name flowtab-web \
  --restart unless-stopped \
  -p 3002:80 \
  -v "${PROJECT_ROOT}/apps/web:/app:rw,Z" \
  -e REACT_APP_API_URL="http://localhost:3000/api" \
  --userns=keep-id \
  --workdir /app \
  --net host \
  docker.io/library/node:20-alpine npm start

# ----------------------------------------------------------------------
#  All containers are up
# ----------------------------------------------------------------------
echo "FlowTab development stack is RUNNING!"
echo "   Web Frontend       : http://localhost:3002"
echo "   Queue Service      : http://localhost:3000  (FOH – waitlist, ETA)"
echo "   Analytics Service  : http://localhost:3001  (BOH – dashboards)"
echo "   PostgreSQL         : postgres://localhost:5432/flowtab"
echo "   Redis              : redis-cli -h localhost -p 6379"
echo ""
echo "To view logs:  podman logs -f flowtab-<service>"
echo "To stop:       for c in flowtab-queue-service flowtab-analytics-service flowtab-web flowtab-postgres flowtab-redis; do podman stop \$c; done"
