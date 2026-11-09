# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Build: renders the static site, the A4 PDF and the social card.
# Chromium lives here and never reaches the runtime image.
# ---------------------------------------------------------------------------
FROM node:24-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
    fonts-dejavu-core \
  && rm -rf /var/lib/apt/lists/*

# Use the distro Chromium instead of downloading Chrome, and allow it to run
# as root inside the build container.
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PUPPETEER_NO_SANDBOX=1 \
    NEXT_TELEMETRY_DISABLED=1

RUN npm install -g pnpm@11.18.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build:pdf

# ---------------------------------------------------------------------------
# Runtime: static-web-server, a single ~4 MB binary. No Node, no Chromium.
# One small `sws.toml` adds response headers; everything else is environment
# variables. Pin the version so Dependabot can propose security bumps.
# ---------------------------------------------------------------------------
FROM joseluisq/static-web-server:2.44.1-alpine AS runtime

COPY --from=build /app/out /srv
COPY sws.toml /etc/sws.toml

ENV SERVER_ROOT=/srv \
    SERVER_HOST=0.0.0.0 \
    SERVER_PORT=3333 \
    SERVER_CONFIG_FILE=/etc/sws.toml \
    SERVER_COMPRESSION=true \
    SERVER_CACHE_CONTROL_HEADERS=false \
    SERVER_ERROR_PAGE_404=404.html \
    SERVER_HEALTH=true \
    SERVER_LOG_LEVEL=info

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3333/health >/dev/null || exit 1
