import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="web-canvas flex min-h-screen flex-col items-center justify-center px-6 text-fog">
      <p className="font-mono text-[11px] font-semibold tracking-[0.32em] text-ember uppercase">
        404
      </p>

      <h1 className="mt-7 max-w-[20ch] text-center text-[clamp(2rem,6vw,4.25rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
        This page isn&apos;t in the CV.
      </h1>

      <p className="mt-5 max-w-[46ch] text-center text-[15px] leading-relaxed text-fog/70">
        The link may be old, or the page may have moved. Everything worth
        reading is on the one-pager.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-ember px-6 py-3 text-[13.5px] font-semibold text-night transition-opacity hover:opacity-90"
        >
          Back to the CV
        </Link>
        <a
          href="/cv.pdf"
          className="rounded-full border border-white/15 px-6 py-3 text-[13.5px] font-medium text-fog transition-colors hover:border-ember/60 hover:text-ember"
        >
          Download PDF
        </a>
      </div>
    </main>
  )
}
