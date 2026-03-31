FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
RUN apk add --no-cache libc6-compat

FROM base AS builder
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/admin ./apps/admin

RUN pnpm install --frozen-lockfile

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm --filter @meetrun/admin build

FROM nginx:alpine AS production

COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
