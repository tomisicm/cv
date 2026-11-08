import Link from 'next/link'
import { cv } from '@/content/cv'
import { CvDocument } from '@/components/cv/CvDocument'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#eceef2] px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[900px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-muted">
            {cv.name} · one page A4
          </p>

          <div className="flex items-center gap-2">
            <Link
              href="/print/"
              className="rounded-md border border-rule bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-white/60"
            >
              View A4
            </Link>
            <a
              href="/cv.pdf"
              download="mihailo-tomisic-cv.pdf"
              className="rounded-md bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Download PDF
            </a>
          </div>
        </div>

        {/* The web preview: same document, more generous type, fluid width. */}
        <div className="cv-web rounded-sm bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_12px_32px_-8px_rgb(0_0_0/0.18)] sm:p-10">
          <CvDocument cv={cv} />
        </div>

        <p className="mt-5 text-center text-[12px] text-muted">
          The PDF is generated from this page at build time and contains selectable,
          searchable text.
        </p>
      </div>
    </main>
  )
}
