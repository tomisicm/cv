'use client'

import { useEffect, useRef } from 'react'

/**
 * Background visualisation: a square-wave Fourier approximation, drawn as a
 * chain of rotating vectors on the left and the accumulated waveform on the
 * right.
 *
 * Adapted for use behind page content: transparent, single accent colour,
 * DPR-aware, resizes with the viewport, and renders one static frame when the
 * visitor prefers reduced motion.
 */

const HARMONICS = 7
const SPEED = 0.014

export function FourierWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let width = 0
    let height = 0
    let frame = 0
    let time = 0
    let history: number[] = []

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      width = bounds.width
      height = bounds.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      history = []
    }

    const colours = () => {
      const style = getComputedStyle(canvas)
      return {
        fog: style.getPropertyValue('--color-fog').trim() || '#eceef2',
        ember: style.getPropertyValue('--color-ember').trim() || '#ff6a3d',
      }
    }

    const paint = () => {
      const { fog, ember } = colours()

      const midY = height * 0.52
      const centreX = width * 0.3
      const waveStartX = width * 0.54
      const waveEndX = width - 4
      const base = Math.min(width, height) * 0.24

      // background is transparent on purpose
      context.clearRect(0, 0, width, height)

      let x = centreX
      let y = midY

      // rotating vectors
      for (let index = 0; index < HARMONICS; index += 1) {
        const previousX = x
        const previousY = y

        const n = index * 2 + 1
        const radius = base * (4 / (n * Math.PI))

        x += radius * Math.cos(n * time)
        y += radius * Math.sin(n * time)

        context.beginPath()
        context.arc(previousX, previousY, radius, 0, Math.PI * 2)
        context.strokeStyle = `${fog}33`
        context.lineWidth = 1.4
        context.stroke()

        context.beginPath()
        context.moveTo(previousX, previousY)
        context.lineTo(x, y)
        context.strokeStyle = `${ember}99`
        context.lineWidth = 1.8
        context.stroke()
      }

      // tip
      context.beginPath()
      context.arc(x, y, 4.5, 0, Math.PI * 2)
      context.fillStyle = ember
      context.fill()

      // record the tip's vertical position
      history.unshift(y)
      const maxHistory = Math.max(1, Math.round(waveEndX - waveStartX))
      if (history.length > maxHistory) history.pop()

      // baseline
      context.beginPath()
      context.moveTo(waveStartX, midY)
      context.lineTo(waveEndX, midY)
      context.strokeStyle = `${fog}26`
      context.lineWidth = 1.2
      context.setLineDash([4, 6])
      context.stroke()
      context.setLineDash([])

      // plotted wave
      context.beginPath()
      for (let index = 0; index < history.length; index += 1) {
        const plotX = waveStartX + index
        if (plotX > waveEndX) break
        if (index === 0) context.moveTo(plotX, history[index])
        else context.lineTo(plotX, history[index])
      }
      context.strokeStyle = `${ember}e6`
      context.lineWidth = 2.4
      context.stroke()

      // cross-over connector
      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(waveStartX, y)
      context.strokeStyle = `${ember}66`
      context.lineWidth = 1.3
      context.setLineDash([3, 5])
      context.stroke()
      context.setLineDash([])
    }

    const animate = () => {
      time += SPEED
      paint()
      frame = requestAnimationFrame(animate)
    }

    resize()

    if (reduceMotion) {
      // Seed one full waveform so the static frame still reads as a graph.
      const maxHistory = Math.max(1, Math.round(width - width * 0.54 - 4))
      for (let index = 0; index < maxHistory; index += 1) {
        time += SPEED
        let sampleY = height * 0.52
        for (let harmonic = 0; harmonic < HARMONICS; harmonic += 1) {
          const n = harmonic * 2 + 1
          const radius = Math.min(width, height) * 0.24 * (4 / (n * Math.PI))
          sampleY += radius * Math.sin(n * time)
        }
        history.unshift(sampleY)
      }
      paint()
    } else {
      frame = requestAnimationFrame(animate)
    }

    const observer = new ResizeObserver(() => {
      resize()
      if (reduceMotion) paint()
    })
    observer.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="h-full w-full" />
}
