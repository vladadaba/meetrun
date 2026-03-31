FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
RUN apk update && apk add --no-cache openssl libc6-compat

FROM base AS builder
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY services/core ./services/core

RUN pnpm install --frozen-lockfile

WORKDIR /app/services/core

ENV DATABASE_URL=postgresql://localhost:5432/postgres?schema=meetrun
RUN pnpm exec prisma generate

RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/core/dist ./services/core/dist
COPY --from=builder /app/services/core/prisma ./services/core/prisma
COPY --from=builder /app/services/core/node_modules ./services/core/node_modules

WORKDIR /app/services/core

USER node

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/src/main.js"]
