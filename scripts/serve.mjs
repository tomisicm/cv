import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { serve } from './static-server.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outDir = join(root, 'out')

if (!existsSync(join(outDir, 'index.html'))) {
  console.error('No build found. Run `pnpm build` first.')
  process.exit(1)
}

const port = Number(process.env.PORT ?? 4173)
const { port: actualPort } = await serve(outDir, port)

console.log(`Serving ${outDir}`)
console.log(`  CV:    http://127.0.0.1:${actualPort}/`)
console.log(`  Print: http://127.0.0.1:${actualPort}/print/`)
