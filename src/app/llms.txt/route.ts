import { cv } from '@/content/cv'

export const dynamic = 'force-static'

/**
 * Machine-readable summary for LLM crawlers, generated from the same content as
 * the site and the PDF so it can never drift.
 *
 * Format: https://llmstxt.org
 */
function buildDocument(): string {
  const lines: string[] = [
    `# ${cv.name} — ${cv.role}`,
    '',
    `> ${cv.summary}`,
    '',
    `- Location: ${cv.location}`,
    `- Email: ${cv.email}`,
  ]

  if (cv.availability) lines.push(`- Availability: ${cv.availability}`)

  lines.push(
    '- CV, one page A4 PDF: https://cv.tomisic.dev/cv.pdf',
    '- Website: https://cv.tomisic.dev',
    '- Work case study: https://cv.tomisic.dev/work',
    '- Other project: renovateIT, a renovation marketplace (NestJS, Next.js, Postgres, Redis) that was not launched',
    '- Walkthrough of the time-tracking platform available on request',
  )

  for (const link of cv.links) {
    lines.push(`- ${link.label}: ${link.href}`)
  }

  lines.push('', '## Experience', '')

  for (const role of cv.experience) {
    const company = role.company ? ` — ${role.company}` : ''
    const client = role.client ? ` (client: ${role.client})` : ''

    lines.push(`### ${role.role}${company}${client}`)
    lines.push(`${role.start} – ${role.end}`)

    for (const bullet of role.bullets) {
      lines.push(`- ${bullet.text}`)
    }

    lines.push(`Tech: ${role.tech.join(', ')}`, '')
  }

  lines.push('## Skills', '')

  for (const group of cv.skills) {
    lines.push(`- ${group.label}: ${group.items.join(', ')}`)
  }

  lines.push('', '## Education', '')

  for (const entry of cv.education) {
    lines.push(`- ${entry.degree}, ${entry.school} (${entry.start}–${entry.end})`)
  }

  lines.push('', '## Languages', '')
  lines.push(cv.languages.join(', '))

  lines.push(
    '',
    '## Notes',
    '',
    '- This document is generated from the same source as the website and PDF.',
    '- The PDF is selectable text, not an image, and is intended for ATS parsing.',
  )

  return `${lines.join('\n')}\n`
}

export function GET() {
  return new Response(buildDocument(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
