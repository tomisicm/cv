'use client'

import { useEffect, useRef } from 'react'

/**
 * Live architecture diagram for the /work case study.
 *
 * Connection lines are drawn between DOM nodes, so the diagram stays correct
 * when the layout reflows. Particles are decorative; the nodes themselves are
 * real text and remain accessible.
 */

type Rect = { x: number; y: number; width: number; height: number }

type Particle = {
  line: number
  t: number
  speed: number
  size: number
}

const LINES = [
  { from: 'ingress', to: 'runtime' },
  { from: 'runtime', to: 'postgres' },
  { from: 'runtime', to: 'redis' },
] as const

const NODE_SELECTOR = '[data-diagram-node]'

export function ArchitectureDiagram() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let width = 0
    let height = 0
    let frame = 0
    let lastSpawn = 0
    let particles: Particle[] = []

    const nodes = () => {
      const bounds = container.getBoundingClientRect()
      const result: Record<string, Rect> = {}

      for (const element of container.querySelectorAll<HTMLElement>(
        NODE_SELECTOR,
      )) {
        const key = element.dataset.diagramNode
        if (!key) continue
        const rect = element.getBoundingClientRect()
        result[key] = {
          x: rect.left - bounds.left,
          y: rect.top - bounds.top,
          width: rect.width,
          height: rect.height,
        }
      }

      return result
    }

    const resize = () => {
      const bounds = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      width = bounds.width
      height = bounds.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (reduceMotion) paint()
    }

    const endpoints = () => {
      const rects = nodes()
      return LINES.map(({ from, to }) => {
        const a = rects[from]
        const b = rects[to]
        if (!a || !b) return null

        if (from === 'runtime') {
          // Fan out from the lower corners instead of the centre.
          const direction = to === 'postgres' ? -1 : 1
          return {
            x1: a.x + a.width / 2 + direction * (a.width / 5),
            y1: a.y + a.height,
            x2: b.x + b.width / 2,
            y2: b.y,
          }
        }

        return {
          x1: a.x + a.width / 2,
          y1: a.y + a.height,
          x2: b.x + b.width / 2,
          y2: b.y,
        }
      })
    }

    const colour = () => {
      const value = getComputedStyle(container).getPropertyValue('--color-ember')
      return value.trim() || '#ff6a3d'
    }

    const draw = () => {
      const ember = colour()
      const links = endpoints()

      context.clearRect(0, 0, width, height)
      context.lineWidth = 1.25
      context.strokeStyle = 'rgba(236, 238, 242, 0.16)'

      for (const link of links) {
        if (!link) continue
        context.beginPath()
        context.moveTo(link.x1, link.y1)
        context.lineTo(link.x2, link.y2)
        context.stroke()
      }

      for (const particle of particles) {
        const link = links[particle.line]
        if (!link) continue

        const x = link.x1 + (link.x2 - link.x1) * particle.t
        const y = link.y1 + (link.y2 - link.y1) * particle.t

        context.beginPath()
        context.arc(x, y, particle.size, 0, Math.PI * 2)
        context.fillStyle = ember
        context.shadowBlur = 8
        context.shadowColor = ember
        context.fill()
        context.shadowBlur = 0
      }
    }

    const paint = () => draw()

    const animate = (now: number) => {
      draw()

      // Steady trickle rather than a burst on the first frames.
      if (now - lastSpawn > 180) {
        lastSpawn = now
        if (particles.length < 24) {
          const line = Math.floor(Math.random() * LINES.length)
          particles.push({
            line,
            t: 0,
            speed: 0.006 + Math.random() * 0.006,
            size: 1.8 + Math.random() * 1.6,
          })
        }
      }

      for (const particle of particles) {
        particle.t += particle.speed
        if (particle.t >= 1) particle.t = 0
      }

      frame = requestAnimationFrame(animate)
    }

    const seed = () => {
      particles = Array.from({ length: 14 }, () => ({
        line: Math.floor(Math.random() * LINES.length),
        t: Math.random(),
        speed: 0.006 + Math.random() * 0.006,
        size: 1.8 + Math.random() * 1.6,
      }))
    }

    resize()
    seed()

    if (reduceMotion) {
      paint()
    } else {
      frame = requestAnimationFrame(animate)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(container)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative flex h-[430px] w-full flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.015] p-6"
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="z-10 flex justify-center" data-diagram-node="ingress">
        <div className="w-60 rounded-lg border border-ember/30 bg-ember/[0.05] px-4 py-3 text-center">
          <p className="font-mono text-[10px] tracking-[0.22em] text-ember uppercase">
            Ingress
          </p>
          <p className="mt-1 text-[14px] font-medium">Cloudflare Tunnel</p>
        </div>
      </div>

      <div className="z-10 flex justify-center" data-diagram-node="runtime">
        <div className="w-72 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3.5 text-center">
          <p className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
            Runtime
          </p>
          <p className="mt-1 text-[14px] font-medium">Next.js · App Router</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-dim uppercase">
            TypeScript
          </p>
        </div>
      </div>

      <div className="z-10 flex justify-center gap-5">
        <div
          data-diagram-node="postgres"
          className="w-[44%] max-w-[220px] rounded-lg border border-white/12 bg-white/[0.02] px-3 py-3 text-center"
        >
          <p className="text-[13.5px] font-medium">Postgres</p>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-dim uppercase">
            Source of truth
          </p>
        </div>

        <div
          data-diagram-node="redis"
          className="w-[44%] max-w-[220px] rounded-lg border border-white/12 bg-white/[0.02] px-3 py-3 text-center"
        >
          <p className="text-[13.5px] font-medium">Redis</p>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-dim uppercase">
            Cache, rate limits
          </p>
        </div>
      </div>
    </div>
  )
}
