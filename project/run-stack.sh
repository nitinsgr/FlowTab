#!/usr/bin/env bash
# ----------------------------------------------------------------------
# run-stack.sh – launch the full FlowTab development stack with Podman
# ----------------------------------------------------------------------
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ----------------------------------------------------------------------
# 0️⃣  Cleanup any existing containers with reserved names
# ----------------------------------------------------------------------
for container in postgres redis queue-service analytics-service frontend; do
  if podman ps -a --format '{{.Names}}' | grep -q "^${container}$"; then
    echo "🧹 Removing existing container '${container}'..."
    podman rm -f "${container}" >/dev/null
  fi
done

echo "🔧 Creating persistent volume 'pg_data'..."
podman volume create pg_data >/dev/null 2>&1 || true

# ----------------------------------------------------------------------
# 1️⃣  Run PostgreSQL
# ----------------------------------------------------------------------
echo "🐘 Starting PostgreSQL..."
podman run -d \
  --name postgres \
  --restart unless-stopped \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=example \
  -e POSTGRES_DB=restaurantdb \
  -p 5432:5432 \
  -v pg_data:/var/lib/postgresql/data \
  docker.io/library/postgres:15-alpine

# ----------------------------------------------------------------------
# 2️⃣  Run Redis (with AOF persistence)
# ----------------------------------------------------------------------
echo "🔴 Starting Redis..."
podman run -d \
  --name redis \
  --restart unless-stopped \
  -p 6379:6379 \
  docker.io/library/redis:7-alpine \
  redis-server --appendonly yes

# ----------------------------------------------------------------------
# 3️⃣  Queue Service (FOH – waitlist, ETA, table allocation)
# ----------------------------------------------------------------------
echo "🛠️  Building and starting queue-service..."
if [ ! -d "${PROJECT_ROOT}/services/queue-service/node_modules" ]; then
  echo "⚙️  Installing queue-service dependencies..."
  pushd "${PROJECT_ROOT}/services/queue-service" >/dev/null
  npm install >/dev/null
  popd >/dev/null
fi

echo "🚀 Starting queue-service container..."
podman run -d \
  --name queue-service \
  --restart unless-stopped \
  -p 3000:3000 \
  -v "${PROJECT_ROOT}/services/queue-service:/app:rw,Z" \
  -e NODE_ENV=development \
  -e DATABASE_URL="postgres://postgres:example@postgres:5432/restaurantdb" \
  -e JWT_SECRET="supersecret" \
  --userns=keep-id \
  --workdir /app \
  node:20-alpine npm run dev

# ----------------------------------------------------------------------
# 4️⃣  Analytics Service (BOH – reporting, admin, KPIs)
# ----------------------------------------------------------------------
echo "📊  Building and starting analytics-service..."
if [ ! -d "${PROJECT_ROOT}/services/analytics-service/node_modules" ]; then
  echo "⚙️  Installing analytics-service dependencies..."
  pushd "${PROJECT_ROOT}/services/analytics-service" >/dev/null
  npm install >/dev/null
  popd >/dev/null
fi

echo "🚀 Starting analytics-service container..."
podman run -d \
  --name analytics-service \
  --restart unless-stopped \
  -p 3002:3001 \
  -v "${PROJECT_ROOT}/services/analytics-service:/app:rw,Z" \
  -e NODE_ENV=development \
  -e DATABASE_URL="postgres://postgres:example@postgres:5432/restaurantdb" \
  -e JWT_SECRET="supersecret" \
  --userns=keep-id \
  --workdir /app \
  node:20-alpine npm run dev

# ----------------------------------------------------------------------
# 5️⃣  Frontend container
# ----------------------------------------------------------------------
echo "🖥️  Starting frontend container..."
if [ ! -d "${PROJECT_ROOT}/frontend/node_modules" ]; then
  echo "⚙️  Installing frontend dependencies..."
  pushd "${PROJECT_ROOT}/frontend" >/dev/null
  npm install >/dev/null
  popd >/dev/null
fi

echo "🚀 Starting frontend container..."
podman run -d \
  --name frontend \
  --restart unless-stopped \
  -p 3001:80 \
  -v "${PROJECT_ROOT}/frontend:/app:rw,Z" \
  -e REACT_APP_API_URL="http://localhost:3000/api" \
  --userns=keep-id \
  --workdir /app \
  node:20-alpine npm start

# ----------------------------------------------------------------------
# ✅  All containers are up!
# ----------------------------------------------------------------------
echo "✅✅✅  Your FlowTab development stack is now RUNNING!"
echo "   • Frontend          : http://localhost:3001"
echo "   • Queue Service     : http://localhost:3000 (FOH – waitlist, ETA, seats)"
echo "   • Analytics Service : http://localhost:3002 (BOH – dashboards, reports)"
echo "   • PostgreSQL        : postgres://localhost:5432/restaurantdb (user: postgres, pw: example)"
echo "   • Redis             : redis-cli -h localhost -p 6379"
echo ""
echo "💡 Tip: To view logs, run:  podman logs -f <container_name>"
echo "   To stop everything:  podman stop queue-service analytics-service frontend postgres redis"
echo "   To completely clean: podman stop queue-service analytics-service frontend postgres redis && podman volume rm pg_data"
