'use client'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // More gradient points with faster movement
    let points = [
      { x: 0, y: 0, dx: 2, dy: 2 },
      { x: canvas.width, y: 0, dx: -2, dy: 2 },
      { x: canvas.width, y: canvas.height, dx: -2, dy: -2 },
      { x: 0, y: canvas.height, dx: 2, dy: -2 },
      { x: canvas.width / 2, y: canvas.height / 2, dx: 3, dy: -3 },
    ]

    const animate = () => {
      if (!canvas || !ctx) return

      // Clear canvas with a darker background
      ctx.fillStyle = '#030303'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update points position with bounds checking
      points = points.map(point => {
        let { x, y, dx, dy } = point
        
        // Bounce off edges with some randomness
        if (x <= 0 || x >= canvas.width) {
          dx *= -1
          dx += (Math.random() - 0.5) * 0.5 // Add slight randomness to movement
        }
        if (y <= 0 || y >= canvas.height) {
          dy *= -1
          dy += (Math.random() - 0.5) * 0.5
        }
        
        return {
          x: x + dx,
          y: y + dy,
          dx,
          dy
        }
      })

      // Draw multiple overlapping gradients
      points.forEach((point, i) => {
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, canvas.width * 0.5
        )

        // More vibrant colors with higher opacity
        const colors = [
          'rgba(59, 130, 246, 0.3)',  // blue-500
          'rgba(29, 78, 216, 0.2)',   // blue-700
          'rgba(30, 64, 175, 0.1)',   // blue-800
        ]

        gradient.addColorStop(0, colors[i % colors.length])
        gradient.addColorStop(0.5, 'rgba(29, 78, 216, 0.05)')
        gradient.addColorStop(1, 'transparent')

        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Add more visible grid
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)'
      ctx.lineWidth = 1

      // Larger grid spacing
      const gridSize = 100
      
      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {/* Stronger gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-transparent to-[#030303] opacity-90" />
    </div>
  )
}