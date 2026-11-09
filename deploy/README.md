# Deploying `cv.tomisic.dev` behind Cloudflare Tunnel

Static export served by **static-web-server** — a single small binary. No Node
and no Chromium. The only config file is `sws.toml`, which adds response
headers; everything else is environment variables in `Dockerfile`.

## 1. Build and run

```bash
docker compose build
docker compose up -d
curl -I http://127.0.0.1:3333/          # 200
curl -I http://127.0.0.1:3333/cv.pdf    # 200, application/pdf
curl -s http://127.0.0.1:3333/health    # 200
```

On the server, `./deploy.sh` does all of it: pulls `main`, rebuilds the image
(regenerating `cv.pdf` and `og.png`), restarts, waits for `/health`, then prints
status codes for `/`, `/cv.pdf` and `/llms.txt`.

The port is published on `127.0.0.1` only. Do not change that to `0.0.0.0` —
cloudflared is the only public entrance.

> `docker-compose.yml` joins an external `observability` network. Create it once
> if it does not exist: `docker network create observability`.
>
> **TODO (deferred):** `cv-web` still joins that shared network. It only needs
> its loopback port, so removing it is the right end state — but do it
> deliberately. The steps and the risk are in §10.

## 2. Two tunnels: app + cv

The host runs **two independent `cloudflared` instances**, one per application.
They share the machine but not a token, connector or ingress configuration, so
a token rotation or ingress mistake on one does not take the other down.

| Instance | Tunnel | Token file | Public hostname | Origin |
|---|---|---|---|---|
| `cloudflared@app` | `db377df7-252e-4826-bee3-550a36c2d82d` | `/etc/cloudflared/token-app` | `app.tomisic.dev` | the app's existing origin |
| `cloudflared@cv` | `9170fa71…` | `/etc/cloudflared/token-cv` | `cv.tomisic.dev` | `http://127.0.0.1:3333` |

Both DNS records stay proxied and point at their own tunnel:

```
app.tomisic.dev  CNAME  db377df7-252e-4826-bee3-550a36c2d82d.cfargotunnel.com
cv.tomisic.dev   CNAME  <cv-tunnel-uuid>.cfargotunnel.com
```

`cv.tomisic.dev` must stay out of Cloudflare Access; `app.tomisic.dev` keeps
its Access application. Do not add a wildcard Access policy.

### Install the service template

`deploy/cloudflared@.service` is a systemd template; `%i` becomes `app` or `cv`.

```bash
sudo cp deploy/cloudflared@.service /etc/systemd/system/
sudo systemctl daemon-reload

# stop the old single-instance service
sudo systemctl disable --now cloudflared.service
```

### Tokens

Get each tunnel's **current** token from the dashboard:

**Zero Trust → Networks → Tunnels → select the tunnel → Configure / Refresh
token**

Write each token to its own root-only file. Never reuse one tunnel's token for
the other.

```bash
sudo install -m 600 /dev/stdin /etc/cloudflared/token-app <<'TOKEN'
<paste the app tunnel token>
TOKEN

sudo install -m 600 /dev/stdin /etc/cloudflared/token-cv <<'TOKEN'
<paste the cv tunnel token>
TOKEN
```

Then:

```bash
sudo systemctl enable --now cloudflared@app.service cloudflared@cv.service
```

### Verify

```bash
systemctl status cloudflared@app cloudflared@cv --no-pager
journalctl -u cloudflared@app -n 30 --no-pager
journalctl -u cloudflared@cv  -n 30 --no-pager
```

Each should end with `Registered tunnel connection`. Then run the checker:

```bash
./deploy/verify-tunnels.sh
```

It prints both service states, the last few tunnel log lines, and the two
public status codes. Expected:

```
cv   200
app  302  (Cloudflare Access)
```

`deploy.sh` rebuilds `cv-web`; it does not touch the tunnel services.

### Remove the old single-tunnel files

Once both instances are healthy:

```bash
sudo rm -f /etc/cloudflared/token /etc/cloudflared/cv-token
sudo rm -f /etc/systemd/system/cloudflared.service
sudo systemctl daemon-reload
```

The old `token` and `cv-token` names are ambiguous; removing them prevents a
future restart from silently using the wrong secret.

### If one tunnel is affected

- **Only `app` is down:** rotate `token-app`, restart `cloudflared@app`.
  `cv` keeps serving.
- **Only `cv` is down:** rotate `token-cv`, restart `cloudflared@cv`.
  `app` keeps serving.
- **Both are down:** check the host's network, DNS and both token files. They
  are independent connectors, so a common failure is below both (host,
  network, Cloudflare account).

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

## 6. Security headers

`sws.toml` is copied into the runtime image and sends these on every response:

```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'none'
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Strict-Transport-Security: max-age=31536000
X-Permitted-Cross-Domain-Policies: none
```

`deploy.sh` fails the deploy if any of these disappear.

Notes:

- HSTS is intentionally one year without `includeSubDomains`/`preload`. Add
  those at the edge only after every subdomain is confirmed HTTPS-only.
- The CSP is deliberately partial: it locks framing, `<base>`, plugins and form
  targets, but does not restrict `script-src`/`style-src` because Next.js emits
  inline hydration scripts. That keeps it safe to enable without breaking the app.
- They pass through Cloudflare, so a Response Header Transform Rule is optional
  defence in depth. Use one if you want to change headers without a rebuild.

The state that actually matters for the first request is **Always Use HTTPS**
(§7). HSTS only protects a browser after it has seen the site over HTTPS once.

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
- Prometheus (public): `https://cv.tomisic.dev` via blackbox
- Prometheus (internal): **not currently configured**. If you add a
  `cv-web:3333` scrape, switch it to the public URL or a host-loopback target
  before removing the shared network.
- Logs: static-web-server writes to the container's stdout, so Promtail picks
  them up with no configuration. Give this stream a short retention — a scan
  flood is mostly access-log noise.

## 10. Security maintenance

### Deferred: remove `cv-web` from the shared network

**Risk:** the container is a static file server, but if it were ever
compromised through a future static-web-server or Alpine CVE, the shared
`observability` network would let it reach Postgres, the dental-records app and
the monitoring stack. That is unnecessary blast radius.

**Fix when ready:**

1. Remove the `networks: [observability]` list from the `cv-web` service.
2. Remove the top-level `networks:` section.
3. `docker compose up -d --force-recreate`.
4. Confirm `/`, `/cv.pdf`, `/health` still answer on `127.0.0.1:3333`, and that
   no Prometheus scrape targets `cv-web:3333`.

The loopback port mapping is all the CV needs.

### Cloudflare dashboard (manual)

- **Always Use HTTPS: on.** If `curl -I http://cv.tomisic.dev/` returns `200`
  instead of `301`, this is off.
- **HSTS:** optional at the edge. Start with `max-age=15552000`; add
  `includeSubDomains` only after checking every subdomain, and `preload` only
  if you are prepared for it to be permanent.
- **2FA** on the Cloudflare account. Access stays on `app.tomisic.dev`; the CV
  must stay public.
- Keep the rate-limit and WAF rules from §4 and §5.

### DNS / email

SPF already exists. DMARC does not. Without it, `cv@tomisic.dev` is easier to
spoof, which hurts the site's trustworthiness more than the site itself.

```
_dmarc.tomisic.dev  TXT  "v=DMARC1; p=none; rua=mailto:cv@tomisic.dev; adkim=r; aspf=r"
```

Start at `p=none` with reporting, then move to `p=quarantine` after a few weeks
of clean reports.

### Host hygiene

The host also listens on `0.0.0.0` for Postgres `5432`, the app on `3000`,
Grafana `3100`, Loki `3200`, Prometheus `9090` and SSH `22`. Docker publishes
ports **bypassing UFW**, so a host firewall alone does not cover them.

- Check the router's port-forwarding page. Only SSH (if anything) should be
  reachable from outside; everything else should be LAN-only.
- Prefer binding such services to `127.0.0.1` and reaching them through
  Cloudflare Tunnel or an SSH tunnel.
- SSH: keys only, no root login. 2FA on GitHub and Cloudflare.

### Cadence

- **Continuous:** Dependabot (npm, Docker, GitHub Actions) and GitHub secret
  scanning. The repo is public, so push protection matters.
- **Every change:** CI runs `pnpm audit --audit-level=high`, typecheck and build.
- **Monthly:** merge Dependabot PRs; rebuild the image with
  `docker compose build --pull` to pick up Alpine patches; optionally scan the
  image with Trivy or Grype.
- **Quarterly:** review Cloudflare/TLS/DNS, 2FA, router ports, host updates and
  backups.
- **On a Next.js or static-web-server CVE:** patch within days. Most Next.js
  server CVEs do not apply to a static export, but the build still uses Next.
