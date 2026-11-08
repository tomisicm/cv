/**
 * Mask reveal for display text.
 *
 * Pure CSS: the animation is enabled only when JS has marked the document and
 * the visitor allows motion, so the words are visible in every other case.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 70,
}: {
  text: string
  className?: string
  /** Milliseconds before the first word starts. */
  delay?: number
  /** Milliseconds between words. */
  stagger?: number
}) {
  const words = text.split(' ')

  return (
    <span className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden className="split-word">
          <span style={{ animationDelay: `${delay + index * stagger}ms` }}>
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </span>
  )
}
