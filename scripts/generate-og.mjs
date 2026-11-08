/**
 * Renders the 1200 × 630 social card from the `/og/` route and writes it to
 * `public/og.png` and `out/og.png`.
 *
 * A real file with a `.png` extension matters: Next's built-in `opengraph-image`
 * convention emits an extensionless route, and static hosts then serve it as
 * `application/octet-stream`, which LinkedIn and friends reject.
 */
import { copyFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import { serve } from './static-server.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outDir = join(root, 'out')
const publicCard = join(root, 'public', 'og.png')
const servedCard = join(outDir, 'og.png')

if (!existsSync(join(outDir, 'index.html'))) {
  console.error('No build found in out/. Run `pnpm build` first.')
  process.exit(1)
}

const { server, port } = await serve(outDir, 0)
const browser = await puppeteer.launch({
  args:
    process.env.PUPPETEER_NO_SANDBOX === '1'
      ? ['--no-sandbox', '--disable-setuid-sandbox']
      : undefined,
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  await page.goto(`http://127.0.0.1:${port}/og/`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)

  await mkdir(dirname(publicCard), { recursive: true })
  await page.screenshot({ path: servedCard, type: 'png' })
  await copyFile(servedCard, publicCard)

  console.log('\n✓ Social card rendered')
  console.log('  1200 × 630 → public/og.png')
} finally {
  await browser.close()
  server.close()
}
