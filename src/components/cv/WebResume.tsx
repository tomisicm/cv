import type { Cv } from '@/content/cv';
import { Marquee } from '@/components/web/Marquee';
import { Magnetic } from '@/components/web/Magnetic';
import { LineSidebar } from '@/components/web/LineSidebar';
import { Reveal } from '@/components/web/Reveal';
import { SpotlightCard } from '@/components/web/SpotlightCard';
import { SplitText } from '@/components/web/SplitText';
import { FourierOrnament } from '@/components/web/FourierOrnament';

/**
 * Website presentation. Completely independent of `PrintResume`: the PDF is
 * rendered from `/print/` only, so everything in this file is free to be as
 * animated and opinionated as it likes.
 */

const SECTIONS = [
  { index: '01', id: 'experience', label: 'Experience' },
  { index: '02', id: 'skills', label: 'Skills' },
  { index: '03', id: 'education', label: 'Education' },
  { index: '04', id: 'contact', label: 'Contact' },
];

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-[10.5px] font-semibold tracking-[0.18em] text-ember">
        {index}
      </span>
      <h2 className="font-mono text-[10.5px] font-semibold tracking-[0.3em] text-dim uppercase">
        {title}
      </h2>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function ContactLinks({ cv }: { cv: Cv }) {
  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2.5 font-mono text-[11.5px]">
      <dt className="text-white/40">LOC</dt>
      <dd className="text-fog/80">{cv.location}</dd>

      <dt className="text-white/40">MAIL</dt>
      <dd>
        <a
          className="text-fog/80 underline-offset-4 transition-colors hover:text-ember hover:underline"
          href={`mailto:${cv.email}`}
        >
          {cv.email}
        </a>
      </dd>

      {cv.availability && (
        <>
          <dt className="text-white/40">STATUS</dt>
          <dd className="text-fog/90">{cv.availability}</dd>
        </>
      )}

      {cv.links.map((link) => (
        <div key={link.href} className="contents">
          <dt className="text-white/40">{link.label.toUpperCase()}</dt>
          <dd>
            <a
              className="group inline-flex items-center gap-1 text-fog/80 underline-offset-4 transition-colors hover:text-ember hover:underline"
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.display}
              <span className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function WebResume({ cv }: { cv: Cv }) {
  const stack = Array.from(new Set(cv.skills.flatMap((group) => group.items)));

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <header className="relative pt-16 sm:pt-24">
        <div
          className="rise flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ animationDelay: '80ms' }}
        >
          <span className="inline-flex items-center gap-2 text-ember">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
            </span>
            {cv.role}
          </span>
          <span className="text-white/20">/</span>
          <span className="text-dim">{cv.location}</span>
        </div>

        <div className="relative mt-7">
          {/* Desktop ornament: Fourier epicycles, centred on the name. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-0 hidden aspect-square w-[435px] -translate-y-1/2 text-fog lg:block xl:w-[510px] 2xl:w-[600px]"
          >
            <FourierOrnament />
          </div>

          <h1 className="text-[clamp(3.2rem,10.5vw,9rem)] leading-[0.86] font-semibold tracking-[-0.05em]">
            <SplitText text="Mihailo" delay={80} />
            <br />
            <SplitText text="Tomišić" delay={180} />
            <span className="text-ember">.</span>
          </h1>
        </div>

        <div className="mt-12 grid gap-10 border-t border-white/10 pt-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-16">
          <p
            className="rise max-w-[58ch] text-[15px] leading-[1.75] text-fog/75"
            style={{ animationDelay: '420ms' }}
          >
            {cv.summary}
          </p>

          <div className="rise" style={{ animationDelay: '540ms' }}>
            <ContactLinks cv={cv} />
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Stack ticker                                                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-16 sm:mt-20">
        <Marquee items={stack} />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Body                                                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-20 grid gap-14 lg:grid-cols-[150px_minmax(0,1fr)] lg:gap-20">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-4 font-mono text-[10px] tracking-[0.24em] text-white/30 uppercase">
              Index
            </p>

            <LineSidebar sections={SECTIONS} />

            <div className="mt-8 h-px w-10 bg-white/10" />

            <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.14em] text-white/25 uppercase">
              One page
              <br />
              A4 · PDF
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-24 sm:gap-32">
          {/* ------------------------------------------------------------ */}
          {/* Experience                                                   */}
          {/* ------------------------------------------------------------ */}
          <section id="experience" className="scroll-mt-24">
            <Reveal>
              <SectionHeading index="01" title="Experience" />
            </Reveal>

            <div className="mt-8">
              {cv.experience.map((entry, index) => (
                <Reveal
                  key={`${entry.company ?? ''}-${entry.start}`}
                  delay={index * 60}
                >
                  <SpotlightCard className="group -mx-3 border-t border-white/10 px-3 py-9 first:border-t-0 first:pt-0">
                    <div className="grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-10">
                      <div className="font-mono text-[10.5px] leading-relaxed font-medium tracking-[0.12em] text-dim uppercase">
                        <span className="block text-white/45">{entry.end}</span>
                        <span className="block">{entry.start}</span>
                      </div>

                      <div>
                        <h3 className="text-[23px] leading-tight font-semibold tracking-[-0.02em]">
                          {entry.role}
                        </h3>

                        {entry.company && (
                          <p className="mt-1.5 text-[13px] font-medium text-ember">
                            {entry.company}
                            {entry.client && (
                              <span className="font-normal text-dim">
                                {' · client: '}
                                {entry.client}
                              </span>
                            )}
                          </p>
                        )}

                        <ul className="mt-5 flex flex-col gap-2.5">
                          {entry.bullets.map((bullet) => (
                            <li
                              key={bullet.text}
                              className={`flex gap-3 text-[14px] leading-[1.65] ${
                                bullet.highlight ? 'text-fog/90' : 'text-fog/70'
                              }`}
                            >
                              <span
                                className={`mt-[0.72em] shrink-0 ${
                                  bullet.highlight
                                    ? 'h-[2px] w-5 bg-ember'
                                    : 'h-px w-4 bg-ember/50'
                                }`}
                              />
                              <span>{bullet.text}</span>
                            </li>
                          ))}
                        </ul>

                        <ul className="mt-6 flex flex-wrap gap-2">
                          {entry.tech.map((item) => (
                            <li
                              key={item}
                              className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-dim uppercase transition-colors hover:border-ember/40 hover:text-ember"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------ */}
          {/* Skills                                                       */}
          {/* ------------------------------------------------------------ */}
          <section id="skills" className="scroll-mt-24">
            <Reveal>
              <SectionHeading index="02" title="Skills" />
            </Reveal>

            <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {cv.skills.map((group, index) => (
                <Reveal key={group.label} delay={index * 50}>
                  <div className="group border-l border-white/10 pl-5 transition-colors hover:border-ember/50">
                    <h3 className="font-mono text-[10.5px] font-semibold tracking-[0.24em] text-ember uppercase">
                      {group.label}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-[1.7] text-fog/75">
                      {group.items.join('  ·  ')}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------ */}
          {/* Education                                                    */}
          {/* ------------------------------------------------------------ */}
          <section id="education" className="scroll-mt-24">
            <Reveal>
              <SectionHeading index="03" title="Education" />
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {cv.education.map((entry, index) => (
                <Reveal key={entry.degree} delay={index * 80}>
                  <div className="h-full rounded-lg border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-ember/30 hover:bg-white/[0.035]">
                    <p className="font-mono text-[10.5px] font-medium tracking-[0.16em] text-dim">
                      {entry.start} — {entry.end}
                    </p>
                    <h3 className="mt-3 text-[16px] leading-snug font-medium">
                      {entry.degree}
                    </h3>
                    <p className="mt-1 text-[13px] text-dim">{entry.school}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10.5px] font-medium tracking-[0.24em] text-white/45 uppercase">
                  Languages
                </span>
                {cv.languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-fog/75"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </Reveal>
          </section>

          {/* ------------------------------------------------------------ */}
          {/* Contact / PDF                                                */}
          {/* ------------------------------------------------------------ */}
          <section id="contact" className="scroll-mt-24">
            <Reveal>
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-panel/60 p-8 sm:p-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-ember/20 blur-3xl"
                />

                <div className="relative sm:flex sm:items-center sm:justify-between sm:gap-12">
                  <div>
                    <p className="font-mono text-[10.5px] font-semibold tracking-[0.24em] text-ember uppercase">
                      One page · A4
                    </p>
                    <h2 className="mt-3 text-[28px] leading-tight font-semibold tracking-[-0.02em]">
                      Prefer paper?
                    </h2>
                    <p className="mt-2 max-w-[46ch] text-[14px] leading-relaxed text-fog/65">
                      The same content, typeset for print. Selectable text and
                      clickable links, not a screenshot.
                    </p>
                  </div>

                  <Magnetic className="mt-7 shrink-0 sm:mt-0">
                    <a
                      href="/cv.pdf"
                      download="mihailo-tomisic-cv.pdf"
                      className="group inline-flex items-center gap-3 rounded-full bg-ember px-6 py-3.5 text-[13px] font-semibold text-night transition-shadow hover:shadow-[0_0_40px_-4px_rgb(255_106_61/0.7)]"
                    >
                      Download PDF
                      <span className="transition-transform group-hover:translate-y-0.5">
                        ↓
                      </span>
                    </a>
                  </Magnetic>
                </div>

                <div className="relative mt-8 border-t border-white/10 pt-6">
                  <a
                    className="group inline-flex items-center gap-2 text-[13px] text-fog/70 transition-colors hover:text-ember"
                    href={`mailto:${cv.email}`}
                  >
                    {cv.email}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  );
}
