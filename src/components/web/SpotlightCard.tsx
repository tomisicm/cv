'use client'

import { useRef, type PointerEvent, type ReactNode } from 'react'

/**
 * Card with a warm glow that follows the cursor.
 *
 * The pointer position is written straight to CSS custom properties instead of
 * React state, so moving the mouse never triggers a re-render.
 */
export function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    element.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    element.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className={`spotlight-card relative ${className}`}
    >
      {children}
    </div>
  )
}
