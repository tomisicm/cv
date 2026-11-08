import type { Cv } from '@/content/cv'
import { Section } from './Section'

/**
 * PDF presentation: one column, no decorative markup.
 *
 * Kept separate from `WebResume` so the website can be restyled freely without
 * any chance of changing what recruiters download. Both read `content/cv.ts`,
 * so the facts stay in one place.
 *
 * Do not add side-by-side blocks here: Chrome emits PDF text in a global
 * top-to-bottom order, so columns interleave when the PDF is copied or parsed.
 */

function ExperienceEntry({ entry }: { entry: Cv['experience'][number] }) {
  return (
    <article className="mb-[0.85em] break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-[1em]">
        <h3 className="text-[0.98em] leading-snug font-semibold">{entry.role}</h3>
        <span className="shrink-0 text-[0.76em] whitespace-nowrap text-muted tabular-nums">
          {entry.start} — {entry.end}
        </span>
      </div>

      {entry.company && (
        <p className="text-[0.85em] leading-snug font-medium text-accent">
          {entry.company}
          {entry.client && (
            <span className="font-normal text-muted">
              {' · client: '}
              {entry.client}
            </span>
          )}
          {entry.location && (
            <span className="font-normal text-muted"> · {entry.location}</span>
          )}
        </p>
      )}

      <ul className="mt-[0.25em] flex list-disc flex-col gap-[0.2em] pl-[1em] marker:text-muted">
        {entry.bullets.map((bullet) => (
          <li
            key={bullet.text}
            className={
              bullet.highlight
                ? 'text-[0.81em] leading-[1.45] font-medium text-ink'
                : 'text-[0.81em] leading-[1.45] text-ink'
            }
          >
            {bullet.text}
          </li>
        ))}
      </ul>

      <p className="mt-[0.24em] text-[0.74em] leading-[1.4] text-muted">
        <span className="font-medium text-ink/70">Tech</span> · {entry.tech.join(', ')}
      </p>
    </article>
  )
}

export function PrintResume({ cv }: { cv: Cv }) {
  return (
    <article className="flex h-full flex-col">
      <header>
        <h1 className="text-[2.5em] leading-[1.02] font-semibold tracking-[-0.022em]">
          {cv.name}
        </h1>
        <p className="mt-[0.32em] text-[1em] leading-snug font-medium text-accent">
          {cv.role}
        </p>

        <address className="mt-[0.5em] flex flex-wrap gap-x-[1.2em] gap-y-[0.1em] text-[0.78em] leading-[1.5] text-muted not-italic">
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
        </address>
      </header>

      <hr className="mt-[1.1em] border-0 border-t border-rule" />

      <div className="mt-[1.15em] flex flex-1 flex-col gap-[0.95em]">
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
        </Section>

        <Section title="Education">
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
        </Section>

        <Section title="Languages">
          <p className="text-[0.8em] leading-[1.45] text-muted">
            {cv.languages.join(' · ')}
          </p>
        </Section>
      </div>
    </article>
  )
}
