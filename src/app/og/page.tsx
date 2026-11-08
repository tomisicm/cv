import type { Metadata } from 'next'
import { cv } from '@/content/cv'
import { geistMono } from '../web-fonts'

export const metadata: Metadata = {
  title: { absolute: `${cv.name} — social card` },
  robots: { index: false, follow: false },
}

/**
 * The 1200 × 630 social card, rendered by `scripts/generate-og.mjs` into
 * `public/og.png`. Kept as a real page so it uses the same fonts and content
 * as the site, instead of a second hand-written template.
 */
export default function OgPage() {
  return (
    <main
      className={`${geistMono.variable} flex h-[630px] w-[1200px] flex-col justify-between overflow-hidden p-16 text-fog`}
      style={{
        backgroundColor: '#090a0c',
        backgroundImage:
          'radial-gradient(70% 60% at 12% 0%, rgba(255,106,61,0.20), transparent 68%), radial-gradient(60% 60% at 92% 100%, rgba(88,110,255,0.18), transparent 70%)',
      }}
    >
      <div className="flex items-center gap-4 font-mono text-[22px] tracking-[0.26em] uppercase">
        <span className="h-3.5 w-3.5 rounded-full bg-ember" />
        <span className="text-ember">{cv.role}</span>
        <span className="text-dim">/ {cv.location}</span>
      </div>

      <div>
        <h1 className="text-[136px] leading-none font-semibold tracking-[-0.045em]">
          {cv.name}
        </h1>
        <p className="mt-8 text-[25px] text-dim">
          {cv.email}
          <span className="px-2">·</span>
          {cv.links.map((link) => link.display).join('  ·  ')}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-white/12 pt-6 font-mono text-[20px] tracking-[0.18em] uppercase">
        <span className="text-dim">cv.tomisic.dev</span>
        <span className="text-ember">One page · A4 PDF</span>
      </div>
    </main>
  )
}
