#!/usr/bin/env bash
#
# Check both tunnel instances and both public hostnames.
# Run on the server after installing the template and token files.
set -euo pipefail

echo "==> Services"
for unit in cloudflared@app.service cloudflared@cv.service; do
  if systemctl is-active --quiet "$unit"; then
    echo "  $unit  active"
  else
    echo "  $unit  NOT ACTIVE"
  fi
done

echo "==> Recent tunnel log"
for unit in cloudflared@app cloudflared@cv; do
  echo "-- $unit"
  journalctl -u "$unit" -n 6 --no-pager 2>/dev/null | tail -6 || true
done

echo "==> Domains"
curl -s -o /dev/null -w "  cv   %{http_code}\n" https://cv.tomisic.dev/
curl -s -o /dev/null -w "  app  %{http_code}  (302 = Cloudflare Access)\n" https://app.tomisic.dev/
