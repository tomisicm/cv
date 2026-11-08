import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
}

/**
 * Minimal static file server for the `out/` directory.
 *
 * Next's `output: 'export'` produces plain files, so both the local preview and
 * the PDF job just need to serve them over HTTP (absolute `/_next/...` asset
 * paths do not resolve under `file://`).
 */
export async function serve(root, port = 0, host = '127.0.0.1') {
  const base = resolve(root)

  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url ?? '/', 'http://localhost').pathname,
      )

      let filePath = normalize(join(base, pathname))
      if (!filePath.startsWith(base + '/') && filePath !== base) {
        res.statusCode = 403
        res.end('Forbidden')
        return
      }

      let stats = await stat(filePath).catch(() => null)
      if (stats?.isDirectory()) {
        filePath = join(filePath, 'index.html')
        stats = await stat(filePath).catch(() => null)
      }

      if (!stats?.isFile()) {
        res.statusCode = 404
        res.end('Not found')
        return
      }

      const body = await readFile(filePath)
      res.setHeader(
        'Content-Type',
        MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      )
      res.setHeader('Content-Length', body.byteLength)
      res.end(body)
    } catch (error) {
      res.statusCode = 500
      res.end(String(error))
    }
  })

  await new Promise((resolveListen, reject) => {
    server.once('error', reject)
    server.listen(port, host, resolveListen)
  })

  const address = server.address()
  return {
    server,
    port: typeof address === 'object' && address ? address.port : port,
  }
}
