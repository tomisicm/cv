import type { Metadata } from 'next'
import { cv } from '@/content/cv'
import { PrintResume } from '@/components/cv/PrintResume'

export const metadata: Metadata = {
  title: { absolute: `${cv.name} — print` },
  robots: { index: false, follow: false },
}

/**
 * The exact surface that becomes cv.pdf.
 *
 * It is a real 210 × 297 mm sheet, so what you see at /print/ is what lands in
 * the PDF. `scripts/generate-pdf.mjs` asserts that the content fits inside it
 * and that the output is a single page of real text.
 */
export default function PrintPage() {
  return (
    <main className="a4-sheet">
      <div data-cv-content className="h-full">
        <PrintResume cv={cv} />
      </div>
    </main>
  )
}
