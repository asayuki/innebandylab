# syntax=docker/dockerfile:1.7

FROM oven/bun:1-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
COPY package.json bun.lock* ./
RUN bun install --no-progress

FROM base AS dev
ENV NODE_ENV=development
COPY tsconfig.json ./
COPY src ./src
EXPOSE ${API_PORT}
CMD ["bun", "run", "dev"]

FROM base AS prod
COPY tsconfig.json ./
COPY src ./src
EXPOSE ${API_PORT}
CMD ["bun", "run", "start"]