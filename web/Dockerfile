# syntax=docker/dockerfile:1.7
# -- Dev
FROM oven/bun:1-alpine AS dev
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install
COPY . .
EXPOSE ${APP_PORT}
CMD ["bun", "run", "dev"]
# -- Build
FROM oven/bun:1-alpine AS build
WORKDIR /app
ARG VITE_API_BASE=/API
ARG VITE_SENTRY_DSN=
ENV VITE_API_BASE=${VITE_API_BASE}
ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN}

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install
COPY . .
RUN bun run build

# -- Production
FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist ./
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]