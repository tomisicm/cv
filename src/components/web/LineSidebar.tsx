'use client'

import { useEffect, useState } from 'react'

export interface SidebarSection {
  id: string
  index: string
  label: string
}

/** Height of one row, kept in sync with the `h-9` class below. */
const ROW_HEIGHT = 36

/**
 * Vertical rail navigation for the website.
 *
 * A single ember segment slides along the rail to the hovered item, or back to
 * whichever section is currently in view. Everything is CSS transitions plus a
 * requestAnimationFrame-throttled scroll listener — no animation library.
 */
export function LineSidebar({ sections }: { sections: SidebarSection[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const threshold = window.innerHeight * 0.3
      let next = 0

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= threshold) {
          next = index
        }
      })

      setActiveIndex(next)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sections])

  const markerIndex = hoveredIndex ?? activeIndex

  return (
    <nav aria-label="Sections" onMouseLeave={() => setHoveredIndex(null)}>
      <div className="relative">
        {/* rail */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/10"
        />

        {/* sliding marker */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-9 w-px bg-ember transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{ transform: `translateY(${markerIndex * ROW_HEIGHT}px)` }}
        />

        <ul>
          {sections.map((section, index) => {
            const isActive = index === activeIndex
            const isMarker = index === markerIndex

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  className="group flex h-9 items-center gap-3 pl-4"
                >
                  {/* tick off the rail */}
                  <span
                    aria-hidden
                    className={`h-px transition-all duration-300 motion-reduce:transition-none ${
                      isMarker
                        ? 'w-4 bg-ember'
                        : 'w-2 bg-white/20 group-hover:w-3 group-hover:bg-ember/60'
                    }`}
                  />

                  <span
                    className={`font-mono text-[11px] font-semibold tabular-nums transition-colors duration-300 motion-reduce:transition-none ${
                      isMarker ? 'text-ember' : 'text-fog/60'
                    }`}
                  >
                    {section.index}
                  </span>

                  <span
                    className={`font-mono text-[11px] font-medium tracking-[0.16em] uppercase transition-all duration-300 motion-reduce:transition-none ${
                      isMarker
                        ? 'translate-x-0.5 text-fog'
                        : 'text-dim group-hover:text-fog'
                    }`}
                  >
                    {section.label}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
