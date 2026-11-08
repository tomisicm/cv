'use client'

import { useEffect } from 'react'
import type { Cv } from '@/content/cv'

/**
 * WebMCP: exposes the CV as tools that an in-tab AI agent can call directly.
 *
 * Experimental (W3C Web Machine Learning CG draft, Chromium behind a flag), so
 * this is a progressive enhancement: browsers without the API simply skip it.
 * Read-only tools only — nothing here mutates state.
 */

type ToolResult = {
  content: { type: 'text'; text: string }[]
}

interface WebMcpTool {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, never>
  }
  execute: () => ToolResult
  annotations: { readOnlyHint: boolean }
}

interface WebMcpContext {
  registerTool?: (
    tool: WebMcpTool,
    options?: { signal?: AbortSignal },
  ) => Promise<void>
  provideContext?: (context: { tools: WebMcpTool[] }) => void
}

const text = (value: unknown): ToolResult => ({
  content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
})

function buildTools(cv: Cv): WebMcpTool[] {
  const profile = {
    name: cv.name,
    role: cv.role,
    location: cv.location,
    availability: cv.availability ?? null,
    email: cv.email,
    summary: cv.summary,
    links: cv.links.map((link) => ({ label: link.label, url: link.href })),
    cvPdf: 'https://cv.tomisic.dev/cv.pdf',
  }

  const experience = cv.experience.map((entry) => ({
    role: entry.role,
    company: entry.company ?? null,
    client: entry.client ?? null,
    start: entry.start,
    end: entry.end,
    achievements: entry.bullets.map((bullet) => bullet.text),
    tech: entry.tech,
  }))

  const skills = cv.skills.map((group) => ({
    group: group.label,
    items: group.items,
  }))

  const education = {
    degrees: cv.education.map((entry) => ({
      degree: entry.degree,
      institution: entry.school,
      start: entry.start,
      end: entry.end,
    })),
    languages: cv.languages,
  }

  return [
    {
      name: 'get-cv-profile',
      description:
        "Returns Mihailo Tomišić's professional profile: current role, location, availability, summary, contact details and links to the one-page PDF.",
      inputSchema: { type: 'object', properties: {} },
      execute: () => text(profile),
      annotations: { readOnlyHint: true },
    },
    {
      name: 'get-cv-experience',
      description:
        'Returns the full work history, newest first, including employer, end client, dates, achievements and technologies for each role.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => text(experience),
      annotations: { readOnlyHint: true },
    },
    {
      name: 'get-cv-skills',
      description:
        'Returns the skill groups (languages, backend, frontend, data, platform, AI and LLM) with every item listed.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => text(skills),
      annotations: { readOnlyHint: true },
    },
    {
      name: 'get-cv-education',
      description:
        'Returns degrees, institutions, years, and the languages spoken.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => text(education),
      annotations: { readOnlyHint: true },
    },
  ]
}

export function WebMcpTools({ cv }: { cv: Cv }) {
  useEffect(() => {
    const context: WebMcpContext | undefined =
      (document as Document & { modelContext?: WebMcpContext }).modelContext ??
      (navigator as Navigator & { modelContext?: WebMcpContext }).modelContext

    if (!context) return

    const tools = buildTools(cv)

    // Current API: registerTool + an AbortSignal for cleanup.
    if (typeof context.registerTool === 'function') {
      const controller = new AbortController()

      for (const tool of tools) {
        context
          .registerTool(tool, { signal: controller.signal })
          .catch(() => {
            // A duplicate or rejected registration must not break the page.
          })
      }

      return () => controller.abort()
    }

    // Older preview builds exposed provideContext instead.
    if (typeof context.provideContext === 'function') {
      context.provideContext({ tools })
    }

    return undefined
  }, [cv])

  return null
}
