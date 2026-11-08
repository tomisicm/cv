'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Scroll-triggered fade + rise.
 *
 * The hidden state lives in CSS behind `[data-js]`, so it is only applied once
 * the inline bootstrap script has run. If JS is disabled or fails, this renders
 * as a plain visible block. The IntersectionObserver only flips a class.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  /** Milliseconds before the transition starts. */
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      element.classList.add('is-in')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
