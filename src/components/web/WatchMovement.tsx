/**
 * Watch movement: a gear train with an oscillating balance wheel.
 *
 * Desktop-only decoration beside the name. Pure SVG + CSS transforms, so it
 * costs no JavaScript. Monochrome by design and static when the visitor prefers
 * reduced motion.
 */

function gearPath({
  cx,
  cy,
  outer,
  inner,
  teeth,
}: {
  cx: number
  cy: number
  outer: number
  inner: number
  teeth: number
}) {
  const step = (Math.PI * 2) / teeth
  const point = (angle: number, radius: number) =>
    `${(cx + Math.cos(angle) * radius).toFixed(2)} ${(cy + Math.sin(angle) * radius).toFixed(2)}`

  const segments: string[] = []

  for (let tooth = 0; tooth < teeth; tooth += 1) {
    const base = tooth * step

    segments.push(`${tooth === 0 ? 'M' : 'L'}${point(base, inner)}`)
    segments.push(`L${point(base + step * 0.14, outer)}`)
    segments.push(`L${point(base + step * 0.36, outer)}`)
    segments.push(`L${point(base + step * 0.5, inner)}`)
  }

  segments.push('Z')
  return segments.join(' ')
}

function spiralPath({
  cx,
  cy,
  from,
  to,
  turns,
  segments = 160,
}: {
  cx: number
  cy: number
  from: number
  to: number
  turns: number
  segments?: number
}) {
  const points: string[] = []

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments
    const angle = t * turns * Math.PI * 2
    const radius = from + (to - from) * t
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    points.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return points.join(' ')
}

export function WatchMovement({ className = '' }: { className?: string }) {
  const mainTeeth = gearPath({ cx: 210, cy: 245, outer: 118, inner: 99, teeth: 26 })
  const smallTeeth = gearPath({ cx: 318, cy: 128, outer: 62, inner: 50, teeth: 14 })
  const lowerTeeth = gearPath({ cx: 330, cy: 318, outer: 48, inner: 38, teeth: 12 })

  return (
    <svg
      viewBox="0 0 400 400"
      role="presentation"
      aria-hidden
      className={className}
      fill="none"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* dial */}
      <circle cx="200" cy="205" r="188" stroke="currentColor" strokeOpacity="0.18" />
      <circle cx="200" cy="205" r="176" stroke="currentColor" strokeOpacity="0.1" />

      {/* hour ticks */}
      <g stroke="currentColor" strokeOpacity="0.32">
        {Array.from({ length: 60 }, (_, index) => {
          const angle = (index / 60) * Math.PI * 2
          const long = index % 5 === 0
          const inner = long ? 160 : 167
          return (
            <line
              key={index}
              x1={200 + Math.cos(angle) * inner}
              y1={205 + Math.sin(angle) * inner}
              x2={200 + Math.cos(angle) * 174}
              y2={205 + Math.sin(angle) * 174}
              strokeWidth={long ? 1.4 : 0.9}
            />
          )
        })}
      </g>

      {/* main gear */}
      <g className="watch-gear watch-gear-main">
        <path d={mainTeeth} stroke="currentColor" strokeOpacity="0.58" />
        <circle cx="210" cy="245" r="86" stroke="currentColor" strokeOpacity="0.24" />
        <circle cx="210" cy="245" r="26" stroke="currentColor" strokeOpacity="0.58" />
        <g stroke="currentColor" strokeOpacity="0.34">
          {Array.from({ length: 6 }, (_, index) => {
            const angle = (index / 6) * Math.PI * 2
            return (
              <line
                key={index}
                x1={210 + Math.cos(angle) * 28}
                y1={245 + Math.sin(angle) * 28}
                x2={210 + Math.cos(angle) * 84}
                y2={245 + Math.sin(angle) * 84}
              />
            )
          })}
        </g>
        <circle cx="210" cy="245" r="4" fill="currentColor" fillOpacity="0.6" stroke="none" />
      </g>

      {/* upper gear */}
      <g className="watch-gear watch-gear-small">
        <path d={smallTeeth} stroke="currentColor" strokeOpacity="0.52" />
        <circle cx="318" cy="128" r="18" stroke="currentColor" strokeOpacity="0.48" />
        <g stroke="currentColor" strokeOpacity="0.34">
          {Array.from({ length: 5 }, (_, index) => {
            const angle = (index / 5) * Math.PI * 2
            return (
              <line
                key={index}
                x1={318 + Math.cos(angle) * 19}
                y1={128 + Math.sin(angle) * 19}
                x2={318 + Math.cos(angle) * 43}
                y2={128 + Math.sin(angle) * 43}
              />
            )
          })}
        </g>
        <circle cx="318" cy="128" r="3.5" fill="currentColor" fillOpacity="0.55" stroke="none" />
      </g>

      {/* lower gear */}
      <g className="watch-gear watch-gear-lower">
        <path d={lowerTeeth} stroke="currentColor" strokeOpacity="0.48" />
        <circle cx="330" cy="318" r="13" stroke="currentColor" strokeOpacity="0.4" />
        <circle cx="330" cy="318" r="3" fill="currentColor" fillOpacity="0.5" stroke="none" />
      </g>

      {/* balance wheel + hairspring */}
      <g className="watch-balance">
        <circle cx="92" cy="108" r="46" stroke="currentColor" strokeOpacity="0.52" />
        <circle cx="92" cy="108" r="40" stroke="currentColor" strokeOpacity="0.22" />
        <path
          d={spiralPath({ cx: 92, cy: 108, from: 6, to: 34, turns: 5 })}
          stroke="currentColor"
          strokeOpacity="0.34"
          strokeWidth="0.9"
        />
        <g stroke="currentColor" strokeOpacity="0.42">
          {Array.from({ length: 3 }, (_, index) => {
            const angle = (index / 3) * Math.PI
            return (
              <line
                key={index}
                x1={92 - Math.cos(angle) * 44}
                y1={108 - Math.sin(angle) * 44}
                x2={92 + Math.cos(angle) * 44}
                y2={108 + Math.sin(angle) * 44}
              />
            )
          })}
        </g>
        <circle cx="92" cy="108" r="4" fill="currentColor" fillOpacity="0.6" stroke="none" />
      </g>

      {/* plated jewels */}
      <g stroke="currentColor" strokeOpacity="0.4">
        <circle cx="200" cy="82" r="5" />
        <circle cx="128" cy="300" r="5" />
        <circle cx="356" cy="228" r="4" />
      </g>

      {/* bridge line */}
      <path
        d="M60 176 L118 152"
        stroke="currentColor"
        strokeOpacity="0.26"
        strokeWidth="1.6"
      />
    </svg>
  )
}
