import { cv } from '@/content/cv'
import { WebResume } from '@/components/cv/WebResume'
import { Aurora } from '@/components/web/Aurora'
import { ScrollProgress } from '@/components/web/ScrollProgress'
import { WebMcpTools } from '@/components/web/WebMcpTools'
import { geistMono } from './web-fonts'

const NAV = [
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '/work', label: 'Work' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
]

/**
 * Structured data so search engines can build a Person entity for the name.
 *
 * `ProfilePage` is the Google-supported type for a page whose subject is a
 * single person; a bare `Person` object is valid Schema.org but not a rich
 * result type, so the Rich Results Test reports nothing for it.
 * See https://developers.google.com/search/docs/appearance/structured-data/profile-page
 */
const PROFILE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: cv.name,
    // Unaccented spellings people actually type, so both forms resolve here.
    alternateName: ['Mihailo Tomisic', 'Mihailo Tomisic CV'],
    jobTitle: cv.role,
    description: cv.summary,
    email: cv.email,
    url: 'https://cv.tomisic.dev',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Novi Sad',
      addressCountry: 'RS',
    },
    sameAs: cv.links.map((link) => link.href),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'University of Novi Sad',
    },
    knowsAbout: [
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'AWS',
      'LLM integration',
    ],
  },
}

export default function HomePage() {
  return (
    <div
      id="top"
      className={`${geistMono.variable} web-canvas relative min-h-screen text-fog`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFILE_SCHEMA) }}
      />
      <Aurora />
      <ScrollProgress />
      <WebMcpTools cv={cv} />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-night/60 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between px-5 sm:px-8">
            <a href="#top" className="group flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded bg-ember font-mono text-[10px] font-bold text-night">
                MT
              </span>
              <span className="hidden font-mono text-[10.5px] font-medium tracking-[0.2em] text-dim uppercase transition-colors group-hover:text-fog sm:block">
                cv.tomisic.dev
              </span>
            </a>

            <nav className="hidden items-center gap-8 md:flex">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-mono text-[10.5px] font-medium tracking-[0.2em] text-dim uppercase transition-colors hover:text-fog"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              href="/cv.pdf"
              download="mihailo-tomisic-cv.pdf"
              className="rounded-full border border-white/15 px-4 py-1.5 font-mono text-[10.5px] font-medium tracking-[0.16em] text-fog uppercase transition-colors hover:border-ember/60 hover:text-ember"
            >
              PDF ↓
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <WebResume cv={cv} />
        </main>

        <footer className="relative mt-28 overflow-hidden border-t border-white/10">
          <div aria-hidden className="pointer-events-none px-5 select-none sm:px-8">
            <p className="mx-auto max-w-[1180px] text-[clamp(3rem,15vw,12rem)] leading-none font-semibold tracking-[-0.06em] text-white/[0.04]">
              TOMIŠIĆ
            </p>
          </div>

          <div className="mx-auto max-w-[1180px] px-5 pb-10 sm:px-8">
            <div className="flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[10px] tracking-[0.16em] text-fog/60 uppercase">
                © {new Date().getFullYear()} Mihailo Tomišić
              </p>

              <div className="flex flex-wrap gap-6">
                {cv.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] tracking-[0.16em] text-dim uppercase transition-colors hover:text-ember"
                  >
                    {link.label} ↗
                  </a>
                ))}
                <a
                  href="https://github.com/tomisicm/cv"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] tracking-[0.16em] text-dim uppercase transition-colors hover:text-ember"
                >
                  Source ↗
                </a>
              </div>

              <p className="font-mono text-[10px] tracking-[0.16em] text-fog/50 uppercase">
                Next.js · static export
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
