/** Infinite horizontal ticker. Pure CSS, pauses on hover. */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items]

  return (
    <div className="marquee relative overflow-hidden border-y border-white/10 py-4">
      <div className="marquee-track flex w-max">
        {row.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-3 pr-9 font-mono text-[10.5px] font-medium tracking-[0.2em] whitespace-nowrap text-fog/60 uppercase"
          >
            <span className="h-1 w-1 rounded-full bg-ember/70" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
