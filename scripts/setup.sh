#!/bin/bash
set -e

echo "=== MeetRun.fun Local Setup ==="
echo ""

# 1. Copy .env files if they don't exist
if [ ! -f services/core/.env ]; then
  cp services/core/.env.example services/core/.env
  echo "Created services/core/.env"
else
  echo "services/core/.env already exists, skipping"
fi

if [ ! -f apps/web/.env ]; then
  cp apps/web/.env.example apps/web/.env
  echo "Created apps/web/.env"
else
  echo "apps/web/.env already exists, skipping"
fi

if [ ! -f apps/admin/.env ]; then
  cp apps/admin/.env.example apps/admin/.env
  echo "Created apps/admin/.env"
else
  echo "apps/admin/.env already exists, skipping"
fi

# 2. Install dependencies
echo ""
echo "Installing dependencies..."
pnpm install

# 3. Start infrastructure
echo ""
echo "Starting infrastructure (Postgres, Mailpit)..."
docker compose up -d

# 4. Wait for Postgres to be ready
echo ""
echo "Waiting for Postgres to be ready..."
until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done
echo "Postgres is ready!"

# 5. Generate Prisma client and run migrations
echo ""
echo "Generating Prisma client..."
pnpm db:generate

echo "Running database migrations..."
pnpm db:migrate

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Services:"
echo "  Postgres:  localhost:5432"
echo "  Mailpit:   http://localhost:8025"
echo ""
echo "Run 'pnpm dev' to start all apps:"
echo "  Web:    http://localhost:3001"
echo "  Admin:  http://localhost:5173  (admin@meetrun.fun / admin123)"
echo "  API:    http://localhost:3000"
echo "  Docs:   http://localhost:3000/api/docs"
