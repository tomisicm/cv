import type { Cv } from '@/content/cv'
import { Section } from './Section'

type Variant = 'columns' | 'single'

/** A single job. Dates sit on the role line; company on its own line. */
function ExperienceEntry({ entry }: { entry: Cv['experience'][number] }) {
  return (
    <article className="mb-[0.95em] break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-[1em]">
        <h3 className="text-[0.98em] leading-snug font-semibold">{entry.role}</h3>
        <span className="shrink-0 text-[0.76em] whitespace-nowrap text-muted tabular-nums">
          {entry.start} — {entry.end}
        </span>
      </div>

      {entry.company && (
        <p className="text-[0.85em] leading-snug font-medium text-accent">
          {entry.company}
          {entry.location && (
            <span className="font-normal text-muted"> · {entry.location}</span>
          )}
        </p>
      )}

      <ul className="mt-[0.3em] flex list-disc flex-col gap-[0.2em] pl-[1em] marker:text-muted">
        {entry.bullets.map((bullet) => (
          <li key={bullet} className="text-[0.81em] leading-[1.45] text-ink">
            {bullet}
          </li>
        ))}
      </ul>

      <p className="mt-[0.28em] text-[0.74em] leading-[1.4] text-muted">
        <span className="font-medium text-ink/70">Tech</span> · {entry.tech.join(', ')}
      </p>
    </article>
  )
}

/** Skills as label/value rows — one line of text per group, for the PDF. */
function SkillsInline({ cv }: { cv: Cv }) {
  return (
    <div className="flex flex-col gap-[0.28em]">
      {cv.skills.map((group) => (
        <div
          key={group.label}
          className="flex gap-[0.7em] text-[0.78em] leading-[1.45]"
        >
          <span className="w-[6.4em] shrink-0 font-semibold text-ink">
            {group.label}
          </span>
          <span className="text-muted">{group.items.join(' · ')}</span>
        </div>
      ))}
    </div>
  )
}

/** Skills as a stacked rail — visual grouping, used on the web. */
function SkillsRail({ cv }: { cv: Cv }) {
  return (
    <div className="flex flex-col gap-[0.55em]">
      {cv.skills.map((group) => (
        <div key={group.label}>
          <h3 className="text-[0.72em] font-semibold tracking-[0.06em] text-ink">
            {group.label}
          </h3>
          <p className="text-[0.78em] leading-[1.45] text-muted">
            {group.items.join(' · ')}
          </p>
        </div>
      ))}
    </div>
  )
}

function EducationRail({ cv }: { cv: Cv }) {
  return (
    <div>
      {cv.education.map((entry) => (
        <article key={entry.degree} className="mb-[0.7em] break-inside-avoid last:mb-0">
          <h3 className="text-[0.82em] leading-snug font-medium">{entry.degree}</h3>
          <p className="text-[0.77em] leading-snug text-muted">{entry.school}</p>
          <p className="text-[0.73em] text-muted tabular-nums">
            {entry.start} — {entry.end}
          </p>
        </article>
      ))}
    </div>
  )
}

/** One compact line per degree: degree, institution, years. */
function EducationInline({ cv }: { cv: Cv }) {
  return (
    <div className="flex flex-col gap-[0.2em]">
      {cv.education.map((entry) => (
        <p key={entry.degree} className="text-[0.81em] leading-[1.45]">
          <span className="font-medium">{entry.degree}</span>
          <span className="text-muted">
            {' — '}
            {entry.school}
            {', '}
            {entry.start}
            {'–'}
            {entry.end}
          </span>
        </p>
      ))}
    </div>
  )
}

function Contact({ cv }: { cv: Cv }) {
  return (
    <>
      <span>{cv.location}</span>
      <a className="text-inherit no-underline" href={`mailto:${cv.email}`}>
        {cv.email}
      </a>
      {cv.links.map((link) => (
        <a
          key={link.href}
          className="text-inherit no-underline"
          href={link.href}
          target="_blank"
          rel="noreferrer"
        >
          {link.display}
        </a>
      ))}
    </>
  )
}

/**
 * The CV itself, rendered by both the web page and the print route.
 *
 * - `columns`: two-column web layout.
 * - `single`: one-column stack for the PDF. PDF text is emitted in a global
 *   top-to-bottom order, so side-by-side blocks interleave when copied or
 *   parsed. A single column keeps sentences intact.
 *
 * Everything is sized in `em`, so only the container's font-size changes
 * between screen and print.
 */
export function CvDocument({
  cv,
  variant = 'columns',
}: {
  cv: Cv
  variant?: Variant
}) {
  const single = variant === 'single'

  return (
    <article className="flex h-full flex-col">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                           */}
      {/* ---------------------------------------------------------------- */}
      {single ? (
        <header>
          <h1 className="text-[2.5em] leading-[1.02] font-semibold tracking-[-0.022em]">
            {cv.name}
          </h1>
          <p className="mt-[0.32em] text-[1em] leading-snug font-medium text-accent">
            {cv.role}
          </p>
          <address className="mt-[0.5em] flex flex-wrap gap-x-[1.2em] gap-y-[0.1em] text-[0.78em] leading-[1.5] text-muted not-italic">
            <Contact cv={cv} />
          </address>
        </header>
      ) : (
        <header className="flex items-start justify-between gap-[1.5em] max-sm:flex-col max-sm:gap-[0.6em]">
          <div>
            <h1 className="text-[2.5em] leading-[1.02] font-semibold tracking-[-0.022em]">
              {cv.name}
            </h1>
            <p className="mt-[0.32em] text-[1em] leading-snug font-medium text-accent">
              {cv.role}
            </p>
          </div>

          <address className="flex flex-col items-end gap-[0.1em] pt-[0.35em] text-right text-[0.78em] leading-[1.55] text-muted not-italic max-sm:items-start max-sm:pt-0 max-sm:text-left">
            <Contact cv={cv} />
          </address>
        </header>
      )}

      <hr className="mt-[1.1em] border-0 border-t border-rule" />

      {/* ---------------------------------------------------------------- */}
      {/* Body                                                             */}
      {/* ---------------------------------------------------------------- */}
      {single ? (
        <div className="mt-[1.15em] flex flex-1 flex-col gap-[1.05em]">
          <Section title="Profile">
            <p className="text-[0.81em] leading-[1.5] text-ink">{cv.summary}</p>
          </Section>

          <Section title="Experience">
            <div>
              {cv.experience.map((entry) => (
                <ExperienceEntry
                  key={`${entry.company ?? ''}-${entry.start}`}
                  entry={entry}
                />
              ))}
            </div>
          </Section>

          <Section title="Skills">
            <SkillsInline cv={cv} />
          </Section>

          <Section title="Education">
            <EducationInline cv={cv} />
          </Section>

          <Section title="Languages">
            <p className="text-[0.8em] leading-[1.45] text-muted">
              {cv.languages.join(' · ')}
            </p>
          </Section>
        </div>
      ) : (
        <div className="mt-[1.15em] grid flex-1 grid-cols-[1.68fr_1fr] gap-[1.7em] max-md:grid-cols-1 max-md:gap-[1.15em]">
          <div className="flex min-w-0 flex-col gap-[1.15em]">
            <Section title="Profile">
              <p className="text-[0.81em] leading-[1.5] text-ink">{cv.summary}</p>
            </Section>

            <Section title="Experience">
              <div>
                {cv.experience.map((entry) => (
                  <ExperienceEntry
                    key={`${entry.company ?? ''}-${entry.start}`}
                    entry={entry}
                  />
                ))}
              </div>
            </Section>
          </div>

          <aside className="flex min-w-0 flex-col gap-[1.15em] border-l border-rule pl-[1.4em] max-md:border-l-0 max-md:pl-0">
            <Section title="Skills">
              <SkillsRail cv={cv} />
            </Section>

            <Section title="Education">
              <EducationRail cv={cv} />
            </Section>

            <Section title="Languages">
              <ul className="flex flex-col gap-[0.1em] text-[0.78em] leading-[1.45] text-muted">
                {cv.languages.map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
            </Section>
          </aside>
        </div>
      )}
    </article>
  )
}
