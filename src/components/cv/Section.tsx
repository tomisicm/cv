interface SectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

/**
 * A titled block with a hairline rule that runs to the edge of the column.
 */
export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={className}>
      <h2 className="mb-[0.6em] flex items-center gap-[0.7em] text-[0.72em] font-semibold tracking-[0.07em] text-muted uppercase">
        {title}
        <span aria-hidden className="h-px flex-1 bg-rule" />
      </h2>
      {children}
    </section>
  )
}
