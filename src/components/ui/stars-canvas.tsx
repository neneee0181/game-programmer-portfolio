import { useEffect, useRef } from "react"

interface StarsCanvasProps {
  transparent?: boolean
  maxStars?: number
  hue?: number
  brightness?: number
  speedMultiplier?: number
  twinkleIntensity?: number
  className?: string
  paused?: boolean
}

export function StarsCanvas({
  transparent = false,
  maxStars = 1200,
  hue = 217,
  brightness = 0.8,
  speedMultiplier = 1,
  twinkleIntensity = 20,
  className = "",
  paused = false,
}: StarsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const context = ctx

    let w = 0
    let h = 0
    let stars: Star[] = []
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

    const texture = document.createElement("canvas")
    const textureCtx = texture.getContext("2d")
    if (!textureCtx) return
    texture.width = 100
    texture.height = 100
    const half = texture.width / 2
    const glow = textureCtx.createRadialGradient(half, half, 0, half, half, half)
    glow.addColorStop(0.025, "#fff")
    glow.addColorStop(0.1, `hsl(${hue}, 61%, 55%)`)
    glow.addColorStop(0.25, `hsla(${hue}, 64%, 16%, 0.55)`)
    glow.addColorStop(1, "transparent")
    textureCtx.fillStyle = glow
    textureCtx.beginPath()
    textureCtx.arc(half, half, half, 0, Math.PI * 2)
    textureCtx.fill()

    const random = (min: number, max?: number) => {
      const upper = max ?? min
      const lower = max === undefined ? 0 : min
      return Math.random() * (upper - lower) + lower
    }
    const maxOrbit = (x: number, y: number) => Math.hypot(Math.max(x, y), Math.max(x, y)) / 2

    class Star {
      orbitRadius = random(maxOrbit(w, h))
      radius = random(2.2, 8)
      orbitX = w / 2
      orbitY = h / 2
      timePassed = random(Math.PI * 2)
      speed = (random(0.16, 1) / 50000) * speedMultiplier
      alpha = random(0.25, 1) * brightness

      draw() {
        const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX
        const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY
        const twinkle = Math.floor(random(twinkleIntensity))
        if (twinkle === 1) this.alpha = Math.max(0.08, this.alpha - 0.025)
        if (twinkle === 2) this.alpha = Math.min(brightness, this.alpha + 0.025)
        context.globalAlpha = this.alpha
        context.drawImage(texture, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius)
        this.timePassed += this.speed
      }
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * pixelRatio)
      canvas.height = Math.round(h * pixelRatio)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      stars = Array.from({ length: maxStars }, () => new Star())
    }

    const animate = () => {
      if (paused) return
      context.globalCompositeOperation = "source-over"
      context.globalAlpha = 1
      if (transparent) {
        context.clearRect(0, 0, w, h)
      } else {
        context.fillStyle = "#030712"
        context.fillRect(0, 0, w, h)
      }
      context.globalCompositeOperation = "lighter"
      for (const star of stars) star.draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    animationRef.current = requestAnimationFrame(animate)
    window.addEventListener("resize", resize)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [transparent, maxStars, hue, brightness, speedMultiplier, twinkleIntensity, paused])

  return <canvas ref={canvasRef} className={`fixed inset-0 block h-full w-full ${className}`} aria-hidden="true" />
}

export default StarsCanvas
