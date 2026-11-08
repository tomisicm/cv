'use client'

import { useRef, type PointerEvent, type ReactNode } from 'react'

/**
 * Pulls its child toward the cursor while hovered.
 *
 * Written against the DOM directly instead of an animation library: the whole
 * effect is a transform plus a transition, and this keeps the page's JS budget
 * for actual content.
 */
export function Magnetic({
  children,
  className = '',
  strength = 0.28,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = element.getBoundingClientRect()
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength

    element.style.transition = 'transform 120ms linear'
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  function handlePointerLeave() {
    const element = ref.current
    if (!element) return

    element.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
    element.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}
