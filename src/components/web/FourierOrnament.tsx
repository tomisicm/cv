'use client'

import { useEffect, useRef } from 'react'

/**
 * Fourier epicycles tracing a lemniscate.
 *
 * The curve is exactly four harmonics:
 *
 *   z(t) = 0.5·e^{it} + 0.5·e^{-it} + 0.25·e^{i2t} − 0.25·e^{-i2t}
 *        = cos t + i·0.5·sin 2t
 *
 * so the tip follows the drawn curve precisely — there is no approximation and
 * nothing to misalign. Canvas keeps the trail and the chain in perfect sync.
 */
export function FourierOrnament({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const PERIOD = 14000
    const TRAIL = PERIOD * 0.62

    let width = 0
    let height = 0
    let rgb = '236, 238, 242'
    let frame = 0
    let startedAt = performance.now()
    let trail: { time: number; x: number; y: number }[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const color = getComputedStyle(canvas).color
      const match = color.match(/rgba?\(([^)]+)\)/)
      if (match) {
        rgb = match[1]
          .split(',')
          .slice(0, 3)
          .map((part) => part.trim())
          .join(', ')
      }

      trail = []
    }

    const paint = (now: number) => {
      if (!width || !height) return

      const centreX = width / 2
      const centreY = height / 2
      const scale = Math.min(width, height) * 0.31
      const t = reduceMotion ? 1.1 : ((now - startedAt) / PERIOD) * Math.PI * 2

      context.clearRect(0, 0, width, height)

      // faint guide curve
      context.beginPath()
      for (let step = 0; step <= 300; step += 1) {
        const angle = (step / 300) * Math.PI * 2
        const x = centreX + scale * Math.cos(angle)
        const y = centreY + scale * 0.5 * Math.sin(2 * angle)
        if (step === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = `rgba(${rgb}, ${reduceMotion ? 0.5 : 0.12})`
      context.lineWidth = 1.4
      context.stroke()

      // joints of the epicycle chain
      const p0 = { x: centreX, y: centreY }
      const p1 = {
        x: p0.x + scale * 0.5 * Math.cos(t),
        y: p0.y + scale * 0.5 * Math.sin(t),
      }
      const p2 = {
        x: p1.x + scale * 0.5 * Math.cos(-t),
        y: p1.y + scale * 0.5 * Math.sin(-t),
      }
      const p3 = {
        x: p2.x + scale * 0.25 * Math.cos(2 * t),
        y: p2.y + scale * 0.25 * Math.sin(2 * t),
      }
      const tip = {
        x: p3.x + scale * 0.25 * Math.cos(-2 * t + Math.PI),
        y: p3.y + scale * 0.25 * Math.sin(-2 * t + Math.PI),
      }

      // circles
      context.lineWidth = 1
      const circles: [typeof p0, number][] = [
        [p0, scale * 0.5],
        [p1, scale * 0.5],
        [p2, scale * 0.25],
        [p3, scale * 0.25],
      ]

      for (const [joint, radius] of circles) {
        context.beginPath()
        context.arc(joint.x, joint.y, radius, 0, Math.PI * 2)
        context.strokeStyle = `rgba(${rgb}, 0.18)`
        context.lineWidth = 1.5
        context.stroke()
      }

      // arms
      context.beginPath()
      context.moveTo(p0.x, p0.y)
      context.lineTo(p1.x, p1.y)
      context.lineTo(p2.x, p2.y)
      context.lineTo(p3.x, p3.y)
      context.lineTo(tip.x, tip.y)
      context.strokeStyle = `rgba(${rgb}, 0.26)`
      context.lineWidth = 1.4
      context.stroke()

      // joints
      for (const joint of [p1, p2, p3]) {
        context.beginPath()
        context.arc(joint.x, joint.y, 1.8, 0, Math.PI * 2)
        context.fillStyle = `rgba(${rgb}, 0.4)`
        context.fill()
      }

      // trail
      if (!reduceMotion) {
        trail.push({ time: now, x: tip.x, y: tip.y })
        while (trail.length > 2 && now - trail[0].time > TRAIL) trail.shift()

        for (let index = 1; index < trail.length; index += 1) {
          const previous = trail[index - 1]
          const current = trail[index]
          const age = (now - current.time) / TRAIL
          const alpha = Math.max(0, 0.9 * (1 - age))

          context.beginPath()
          context.moveTo(previous.x, previous.y)
          context.lineTo(current.x, current.y)

          context.strokeStyle = `rgba(${rgb}, ${alpha * 0.16})`
          context.lineWidth = 7
          context.stroke()

          context.strokeStyle = `rgba(${rgb}, ${alpha})`
          context.lineWidth = 2.4
          context.stroke()
        }
      }

      // tip
      context.beginPath()
      context.arc(tip.x, tip.y, 4.8, 0, Math.PI * 2)
      context.fillStyle = `rgba(${rgb}, 0.95)`
      context.fill()

      if (!reduceMotion) frame = requestAnimationFrame(paint)
    }

    const start = () => {
      startedAt = performance.now()
      trail = []
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(paint)
    }

    resize()

    const observer = new ResizeObserver(() => {
      resize()
      if (reduceMotion) paint(performance.now())
    })
    observer.observe(canvas)

    if (reduceMotion) paint(performance.now())
    else start()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      role="presentation"
      className={`h-full w-full ${className}`}
    />
  )
}
