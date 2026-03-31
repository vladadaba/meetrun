# MeetRun.fun

Running community meetup platform. Users submit meetups, admins review and approve them.

## Quick Start

```bash
# 1. Start infrastructure (Postgres, Mailpit)
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Generate Prisma client and run migrations
pnpm db:generate
pnpm db:migrate

# 4. Start all apps
pnpm dev
```

Or use the setup script which does steps 1-3:

```bash
./scripts/setup.sh
pnpm dev
```

## URLs

| Service | URL |
|---------|-----|
| Web app | http://localhost:3001 |
| Admin dashboard | http://localhost:5173 |
| API | http://localhost:3000 |
| Swagger docs | http://localhost:3000/api/docs |
| Mailpit | http://localhost:8025 |

## Credentials

**Admin dashboard** (http://localhost:5173):
- Email: `admin@meetrun.fun`
- Password: `admin123`
- You'll be prompted to change the password on first login

The initial admin is created automatically from `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars when the database has zero admins. Only superadmins can create additional admins via `POST /auth/admins`.

## Project Structure

```
meetrun/
├── apps/
│   ├── web/           # Next.js 15 - public meetup listing & submission (port 3001)
│   └── admin/         # Vite + React - admin review dashboard (port 5173)
├── services/
│   └── core/          # NestJS API with Prisma + Postgres (port 3000)
├── scripts/
│   └── setup.sh       # One-time local setup
└── compose.yml        # Postgres, Mailpit
```

## Email

Emails are sent when an admin approves a meetup. In development, they're captured by Mailpit at http://localhost:8025.

Production uses Resend via SMTP - same code, different env vars in `services/core/.env`.
