import { useEffect, useState } from "react"
import { SparkBadge } from "@/components/ui/spark-badge"
import { StarsCanvas } from "@/components/ui/stars-canvas"

// The scene is served as an independent iframe. A per-page-load token prevents
// GitHub Pages/CDN from showing a stale scene after an authored HTML update.
const sourceUrl = `${import.meta.env.BASE_URL}spark-badge.html?v=${Date.now()}`

function App() {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)

  useEffect(() => {
    const startCountdown = () => {
      if (galleryOpen || countdown !== null) return
      setCountdown(5)
    }
    window.addEventListener("keydown", startCountdown)
    window.addEventListener("pointerdown", startCountdown)
    return () => {
      window.removeEventListener("keydown", startCountdown)
      window.removeEventListener("pointerdown", startCountdown)
    }
  }, [countdown, galleryOpen])

  useEffect(() => {
    if (countdown === null || galleryOpen) return
    const timer = window.setTimeout(() => {
      if (countdown <= 1) setGalleryOpen(true)
      else setCountdown((value) => (value === null ? null : value - 1))
    }, 850)
    return () => window.clearTimeout(timer)
  }, [countdown, galleryOpen])

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <StarsCanvas maxStars={1050} hue={217} brightness={0.9} speedMultiplier={0.8} className="z-0" />
      <SparkBadge
        sourceUrl={sourceUrl}
        variant={galleryOpen ? "gallery" : "badge"}
        className="relative z-[1] block h-full w-full overflow-hidden [&_.spark-badge__frame]:h-full [&_.spark-badge__frame]:w-full [&_.spark-badge__frame]:border-0 [&_.spark-badge__frame]:opacity-0 [&_.spark-badge__frame.is-ready]:opacity-100 [&_.spark-badge__frame]:transition-opacity"
      />
      {!galleryOpen && (
        <p className={`pointer-events-none fixed inset-x-0 bottom-5 z-10 text-center font-mono text-[10px] font-medium tracking-[0.26em] transition-all duration-200 sm:bottom-7 sm:text-xs ${countdown === null ? "animate-pulse text-white/80" : "scale-110 text-blue-300 drop-shadow-[0_0_10px_rgba(96,165,250,0.9)]"}`}>
          PRESS ANY KEY{countdown === null ? "" : ` · ${countdown}`}
        </p>
      )}
    </main>
  )
}

export default App
