'use client'

import { useState, type CSSProperties } from 'react'

/**
 * The system, built as an isometric tower.
 *
 * Each layer is a plane inside one `preserve-3d` container, raised with
 * `translateZ`. Selecting a layer lifts everything above it and drops
 * everything below it, opening a gap around the active tier; the detail
 * panel follows the selection.
 *
 * Geometry notes:
 * - `--i` is the layer index from the top and `--center` is the middle index,
 *   so the resting stack is symmetric around the transform origin.
 * - `--lift` is set per layer by the component: positive above the selection,
 *   negative below it, which opens the gap around the active tier.
 * - `--gap` lives on the tower, so hovering the whole stack widens every
 *   floor at once without touching React state.
 */

type Layer = {
  id: string
  index: string
  label: string
  name: string
  detail: string
  points: string[]
}

const LAYERS: Layer[] = [
  {
    id: 'ingress',
    index: '01',
    label: 'Ingress',
    name: 'Cloudflare Tunnel',
    detail:
      'The host makes an outbound connection to Cloudflare, so no inbound port is open on the machine. TLS, WAF and rate limiting happen at the edge; the origin only ever sees requests that already passed them.',
    points: [
      'Outbound-only connection',
      'TLS and rate limiting at the edge',
      'Origin bound to loopback',
    ],
  },
  {
    id: 'runtime',
    index: '02',
    label: 'Runtime',
    name: 'Docker Compose',
    detail:
      'The app, database and cache run as containers on a single host. Compose was chosen over Kubernetes deliberately: the scale does not justify a control plane. Health checks and log rotation are part of the compose definition.',
    points: [
      'One deployable unit',
      'Health checks per container',
      'Migrations as an explicit deploy step',
    ],
  },
  {
    id: 'application',
    index: '03',
    label: 'Application',
    name: 'Next.js · App Router',
    detail:
      'Read paths render on the server, so the first paint already has data. Writes go through route handlers that validate input before it reaches the database. The same TypeScript types are used on both sides of the boundary.',
    points: [
      'Server components for read paths',
      'Validated write endpoints',
      'Types shared end to end',
    ],
  },
  {
    id: 'cache',
    index: '04',
    label: 'Cache',
    name: 'Redis',
    detail:
      'Redis holds rate-limit counters and lookups that can be recomputed. Anything that must survive a restart lives in Postgres, so a Redis flush is an inconvenience rather than an incident.',
    points: [
      'Rate limiting per IP and user',
      'Only recomputable data',
      'Flush-safe by design',
    ],
  },
  {
    id: 'data',
    index: '05',
    label: 'Data',
    name: 'Postgres',
    detail:
      'Time entries relate to projects, clients and rates, which is a join. Reporting stays in SQL rather than application code. Slow statements are logged into the same pipeline as the application.',
    points: [
      'Relational model with foreign keys',
      'Reporting pushed to SQL',
      'Slow-query logging into Loki',
    ],
  },
]

/** How far the layers above and below the selection move, in tower units. */
const SPREAD = 66
const LAST = LAYERS.length - 1
const CENTER = (LAYERS.length - 1) / 2

export function SystemTower() {
  const [selected, setSelected] = useState<string | null>('application')
  const selectedIndex = LAYERS.findIndex((layer) => layer.id === selected)
  const current = selectedIndex >= 0 ? LAYERS[selectedIndex] : null

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
      <div className="flex flex-col">
        <div className="iso-scene flex h-[540px] items-center justify-center">
          <div
            className="iso-tower"
            role="group"
            aria-label="System layers, top to bottom"
          >
            {LAYERS.map((layer, index) => {
              const lift =
                selectedIndex < 0 || index === selectedIndex
                  ? 0
                  : index < selectedIndex
                    ? SPREAD
                    : -SPREAD

              return (
                <button
                  key={layer.id}
                  type="button"
                  className="iso-floor"
                  style={
                    {
                      '--i': index,
                      '--center': CENTER,
                      '--lift': `${lift}px`,
                    } as CSSProperties
                  }
                  aria-pressed={selected === layer.id}
                  aria-controls="system-layer-detail"
                  onClick={() =>
                    setSelected(selected === layer.id ? null : layer.id)
                  }
                >
                  <span className="iso-floor-face">
                    <span className="iso-floor-head">
                      <span className="iso-floor-index">{layer.index}</span>
                      <span className="iso-floor-label">{layer.label}</span>
                    </span>
                    <span className="iso-floor-name">{layer.name}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <p className="-mt-3 text-center font-mono text-[11px] tracking-[0.18em] text-dim/70 uppercase">
          Click a layer to inspect it
        </p>
      </div>

      <aside
        id="system-layer-detail"
        aria-live="polite"
        className="rounded-lg border border-white/10 bg-white/[0.02] p-5 lg:self-center"
      >
        {current ? (
          <>
            <p className="font-mono text-[11px] tracking-[0.22em] text-ember uppercase">
              {current.index} / {LAYERS.length} · {current.label}
            </p>
            <h3 className="mt-3 text-[22px] leading-tight font-semibold tracking-[-0.01em]">
              {current.name}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.7] text-fog/75">
              {current.detail}
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {current.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[13.5px] leading-[1.5] text-fog/65"
                >
                  <span className="mt-[0.6em] h-px w-3 shrink-0 bg-ember/60" />
                  {point}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="font-mono text-[11px] tracking-[0.22em] text-dim uppercase">
              Layer detail
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.7] text-fog/55">
              Select a layer in the stack to see what it does and why it is
              there. Select it again to close the gap.
            </p>
          </>
        )}
      </aside>
    </div>
  )
}
