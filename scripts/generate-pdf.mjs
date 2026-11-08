/**
 * Renders the CV to a real, text-based PDF.
 *
 * Pipeline:
 *   1. serve the static export in `out/` over HTTP
 *   2. open /print/ in headless Chrome (the A4 sheet route)
 *   3. assert the content fits inside one A4 page
 *   4. print to PDF with the CSS page size (210 × 297 mm, zero margin)
 *   5. re-open the produced PDF and assert it is ONE page of REAL TEXT
 *
 * Step 5 is the important one: it is what makes "readable PDF" a build-time
 * guarantee instead of a hope. A rasterized PDF (html2canvas → JPEG → PDF)
 * fails this check, so the pipeline can never silently regress to an image.
 */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import { serve } from './static-server.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outDir = join(root, 'out')
const publicPdf = join(root, 'public', 'cv.pdf')
const servedPdf = join(outDir, 'cv.pdf')

/** Minimum amount of extractable characters we expect on a CV page. */
const MIN_TEXT_CHARS = 400

/** Content that must survive PDF extraction, compared without whitespace. */
const REQUIRED_TEXT = [
  'mihailotomišić',
  'seniorsoftwareengineer',
  'experience',
  'epam',
  'vertrical',
  'beeit',
  'skills',
  'education',
  'typescript',
]

/** Anchors that must appear in this order in the extracted text. */
const ORDER_ANCHORS = [
  'experience',
  'epam',
  'bootstrapped',
  'vertrical',
  'builtscalable',
  'beeit',
  'skills',
  'education',
]

const mm = (px) => (px / 96) * 25.4
const fail = (message) => {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}

if (!existsSync(join(outDir, 'index.html'))) {
  fail('No static build found in out/. Run `pnpm build` first.')
}

const { server, port } = await serve(outDir, 0)
const url = `http://127.0.0.1:${port}/print/`

const browser = await puppeteer.launch({
  // Required when running as root inside a container (e.g. the Docker build).
  args:
    process.env.PUPPETEER_NO_SANDBOX === '1'
      ? ['--no-sandbox', '--disable-setuid-sandbox']
      : undefined,
})

try {
  const page = await browser.newPage()

  // The print route is a fixed 210mm sheet; match the viewport to it so that
  // width-based media queries behave the same as they will in the PDF.
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 })
  await page.goto(url, { waitUntil: 'networkidle0' })
  await page.emulateMediaType('print')
  await page.evaluate(() => document.fonts.ready)

  // ---------------------------------------------------------------- fit check
  const fit = await page.evaluate(() => {
    const content = document.querySelector('[data-cv-content]')
    const article = content?.firstElementChild
    if (!content || !article) return null

    // The document is deliberately stretched (`h-full` + `flex-1`) so the
    // sidebar rule runs the full height of the sheet. Temporarily release the
    // stretch to measure how tall the content actually wants to be.
    const previousHeight = article.style.height
    article.style.height = 'auto'
    const needed = article.getBoundingClientRect().height
    article.style.height = previousHeight

    return {
      available: content.clientHeight,
      used: needed,
      overflow: Math.max(0, needed - content.clientHeight),
    }
  })

  if (!fit) fail('Could not find [data-cv-content] on /print/.')

  if (fit.overflow > 2) {
    fail(
      `CV content overflows the A4 page by ${fit.overflow.toFixed(0)}px ` +
        `(~${mm(fit.overflow).toFixed(1)}mm).\n` +
        `  available: ${fit.available.toFixed(0)}px, used: ${fit.used.toFixed(0)}px\n` +
        `  Trim copy in src/content/cv.ts or lower .a4-sheet font-size in src/app/globals.css.`,
    )
  }

  // ------------------------------------------------------------------ printing
  await mkdir(dirname(publicPdf), { recursive: true })

  const buffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  })

  // ------------------------------------------------------------- verification
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise

  if (doc.numPages !== 1) {
    fail(`Expected 1 page, produced ${doc.numPages}. Content does not fit A4.`)
  }

  const textContent = await (await doc.getPage(1)).getTextContent()
  const rawText = textContent.items
    .filter((item) => 'str' in item)
    .map((item) => item.str)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Extractors differ on where they insert spaces (ligatures such as "fi" and
  // letter-spaced headings are common sources). Compare with all whitespace
  // removed so we test for presence of content, not for glyph spacing.
  const compact = rawText.replace(/\s+/g, '').toLowerCase()

  if (compact.length < MIN_TEXT_CHARS) {
    fail(
      `The PDF contains only ${compact.length} extractable characters. ` +
        `It looks rasterized (an image), not a real document.`,
    )
  }

  const missing = REQUIRED_TEXT.filter((needle) => !compact.includes(needle))
  if (missing.length > 0) {
    fail(
      `PDF text is missing expected content: ${missing.join(', ')}\n` +
        `  extracted: “${rawText.slice(0, 160)}…”`,
    )
  }

  // Reading order matters for anything that parses the PDF: a bullet detached
  // from its job (or a sidebar interleaved into the main column) reads as
  // nonsense to an ATS. Assert the anchors appear in document order.
  const positions = ORDER_ANCHORS.map((anchor) => [
    anchor,
    compact.indexOf(anchor),
  ])
  for (let i = 1; i < positions.length; i += 1) {
    const [previous, previousIndex] = positions[i - 1]
    const [current, currentIndex] = positions[i]
    if (currentIndex <= previousIndex) {
      fail(
        `PDF text is out of order: “${current}” appears before “${previous}”.\n` +
          `  Check for positioned/absolute elements in the CV layout.`,
      )
    }
  }

  await writeFile(servedPdf, buffer)
  await copyFile(servedPdf, publicPdf)

  const sizeKb = (buffer.byteLength / 1024).toFixed(1)
  console.log('\n✓ CV exported as a readable PDF')
  console.log(`  pages:        1 (A4, 210 × 297 mm)`)
  console.log(`  fill:         ${((fit.used / fit.available) * 100).toFixed(0)}% of the page height`)
  console.log(`  size:         ${sizeKb} KB`)
  console.log(`  text:         ${compact.length} extractable characters`)
  console.log(`  fonts:        embedded by Chrome`)
  console.log(`  written to:   public/cv.pdf`)
  console.log(`                out/cv.pdf`)
  console.log(`\n  “${rawText.slice(0, 110)}…”\n`)
} finally {
  await browser.close()
  server.close()
}
