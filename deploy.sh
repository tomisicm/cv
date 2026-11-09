#!/usr/bin/env bash
#
# Server deploy: pull latest main, rebuild the image (which regenerates
# cv.pdf and og.png), restart the container, and verify it answers.
#
# Usage, on the server:
#   cd /opt/apps/cv && ./deploy.sh
set -euo pipefail

cd "$(dirname "$0")"

PORT=3333

echo "==> Pulling latest main"
git pull --ff-only

echo "==> Building and restarting"
docker compose up -d --build

echo "==> Waiting for health"
healthy=0
for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
    healthy=1
    break
  fi
  sleep 2
done

if [ "$healthy" -ne 1 ]; then
  echo "!! container did not become healthy" >&2
  docker compose logs --tail=60 >&2
  exit 1
fi

echo "==> Checks"
curl -s -o /dev/null -w "  /          %{http_code}  %{content_type}\n" "http://127.0.0.1:${PORT}/"
curl -s -o /dev/null -w "  /cv.pdf    %{http_code}  %{content_type}\n" "http://127.0.0.1:${PORT}/cv.pdf"
curl -s -o /dev/null -w "  /llms.txt  %{http_code}  %{content_type}\n" "http://127.0.0.1:${PORT}/llms.txt"

echo "==> Security headers"
headers=$(curl -fsSI "http://127.0.0.1:${PORT}/")
for header in x-content-type-options referrer-policy x-frame-options content-security-policy strict-transport-security; do
  if grep -qi "^${header}:" <<<"$headers"; then
    echo "  ${header}  ok"
  else
    echo "!! missing ${header}; check sws.toml" >&2
    exit 1
  fi
done

echo "==> Containers"
docker compose ps

cat <<'EOF'

Reminder: Cloudflare caches /cv.pdf and /og.png for up to 4 hours with its
default TTL. Either purge those two URLs in the dashboard, or add a Cache Rule
that bypasses them so downloads always match the deploy.
EOF
