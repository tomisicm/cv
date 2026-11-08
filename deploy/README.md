# Deploying `cv.tomisic.dev` behind Cloudflare Tunnel

Static export served by **static-web-server** — a single small binary. No Node,
no Chromium, and no server config files: everything is environment variables in
`Dockerfile`.

## 1. Build and run

```bash
docker compose build
docker compose up -d
curl -I http://127.0.0.1:3333/          # 200
curl -I http://127.0.0.1:3333/cv.pdf    # 200, application/pdf
curl -s http://127.0.0.1:3333/health    # 200
```

The port is published on `127.0.0.1` only. Do not change that to `0.0.0.0` —
cloudflared is the only public entrance.

> `docker-compose.yml` joins an external `observability` network. Create it once
> if it does not exist: `docker network create observability`.

## 2. Tunnel ingress

On this host `cloudflared` runs as a **systemd service with a dashboard-managed
token** (`--token-file /etc/cloudflared/token`), so there is no local
`config.yml`. Add the public hostname in the Cloudflare dashboard:

**Zero Trust → Networks → Tunnels → (your tunnel) → Public Hostnames → Add**

| Field | Value |
|---|---|
| Subdomain | `cv` |
| Domain | `tomisic.dev` |
| Type | HTTP |
| URL | `127.0.0.1:3333` |

**Do not add `cv.tomisic.dev` to Cloudflare Access.** It must be public, unlike
`app.tomisic.dev`.

## 3. Caching — set it at the edge

The origin deliberately sends **no `Cache-Control`** (`SERVER_CACHE_CONTROL_HEADERS=false`).
Because the container is bound to loopback, Cloudflare is the only public path,
so caching policy lives in one place. Add three Cache Rules:

| Rule | Expression | Edge TTL | Browser TTL |
|---|---|---|---|
| Hashed assets | `http.request.uri.path starts with "/_next/static/"` | 1 month | 1 year |
| Artefacts | `http.request.uri.path matches ".*\.(pdf\|png\|svg\|ico\|woff2)$"` | 1 week | 1 week |
| LLM summary | `http.request.uri.path eq "/llms.txt"` | 1 hour | 1 hour |

Everything else (HTML) is not cached, so a deploy is visible immediately.

If you would rather not write Cache Rules, flip `SERVER_CACHE_CONTROL_HEADERS`
to `true` — but note the defaults cache HTML for a day, which makes CV updates
take up to a day to appear.

## 4. The one rate-limit rule (Free plan allows one)

| Field | Value |
|---|---|
| Path | `cv.tomisic.dev` |
| Requests | 60 per 10 seconds |
| Key | Client IP |
| Action | Block, 1 minute |

Human visitors never come close; scripted hammering stops.

## 5. WAF custom rule (Free plan: 5 rules)

Block probe traffic so it never reaches the origin:

```
(http.request.uri.path contains "/.env") or
(http.request.uri.path contains "/wp-login") or
(http.request.uri.path contains "/wp-admin") or
(http.request.uri.path contains "/xmlrpc.php") or
(http.request.uri.path contains "/.git")
```

## 6. Security headers at the edge

Add a **Response Header Transform Rule** (free plan) for `cv.tomisic.dev`:

```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
```

They belong at the edge now, since nothing can reach the origin directly.

## 7. TLS

- SSL/TLS mode: **Full (strict)**
- Always Use HTTPS: **on**
- Minimum TLS: **1.2**

## 8. Optional

- **Bot Fight Mode**: off by default. It challenges legitimate bots and headless
  clients, which conflicts with `llms.txt` and WebMCP.
- **Turnstile**: only needed if a contact form is added later.

## 9. Observability hooks

- Container healthcheck: `GET /health`
- Prometheus (internal): `http://cv-web:8080/health` via blackbox exporter
- Prometheus (public): `https://cv.tomisic.dev` via blackbox
- Logs: static-web-server writes to the container's stdout, so Promtail picks
  them up with no configuration. Give this stream a short retention — a scan
  flood is mostly access-log noise.
