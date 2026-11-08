/**
 * Reading-progress line.
 *
 * Pure CSS via a scroll-driven animation. Browsers without
 * `animation-timeline` simply do not show the bar, which is why it is hidden
 * by default and only enabled inside `@supports`.
 */
export function ScrollProgress() {
  return (
    <div
      aria-hidden
      className="scroll-progress fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-ember"
    />
  )
}
