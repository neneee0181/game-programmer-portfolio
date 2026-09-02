import { useEffect, useState } from "react"
import { SparkBadge } from "@/components/ui/spark-badge"
import { StarsCanvas } from "@/components/ui/stars-canvas"
import { PortfolioGallery } from "@/components/portfolio-gallery"

// The scene is served as an independent iframe. A per-page-load token prevents
// GitHub Pages/CDN from showing a stale scene after an authored HTML update.
const sourceUrl = `${import.meta.env.BASE_URL}spark-badge.html?v=${Date.now()}`

function App() {
  const [countdown, setCountdown] = useState(5)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryVisible, setGalleryVisible] = useState(false)

  useEffect(() => {
    const openGallery = () => setGalleryOpen(true)
    const receiveIframeClick = (event: MessageEvent) => {
      if (event.data?.type === "spark-badge-enter") openGallery()
    }
    window.addEventListener("pointerdown", openGallery)
    window.addEventListener("message", receiveIframeClick)
    return () => {
      window.removeEventListener("pointerdown", openGallery)
      window.removeEventListener("message", receiveIframeClick)
    }
  }, [])

  useEffect(() => {
    if (galleryOpen) return
    const timer = window.setTimeout(() => {
      if (countdown <= 1) setGalleryOpen(true)
      else setCountdown((value) => value - 1)
    }, 850)
    return () => window.clearTimeout(timer)
  }, [countdown, galleryOpen])

  useEffect(() => {
    if (!galleryOpen) return
    const timer = window.setTimeout(() => setGalleryVisible(true), 2450)
    return () => window.clearTimeout(timer)
  }, [galleryOpen])

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <StarsCanvas maxStars={1050} hue={217} brightness={0.9} speedMultiplier={0.8} className="z-0" />
      <SparkBadge
        sourceUrl={sourceUrl}
        variant={galleryOpen ? "gallery" : "badge"}
        className={`relative z-[1] block h-full w-full overflow-hidden transition-opacity duration-1000 ${galleryVisible ? "opacity-35" : "opacity-100"} [&_.spark-badge__frame]:h-full [&_.spark-badge__frame]:w-full [&_.spark-badge__frame]:border-0 [&_.spark-badge__frame]:opacity-0 [&_.spark-badge__frame.is-ready]:opacity-100 [&_.spark-badge__frame]:transition-opacity`}
      />
      {!galleryOpen && (
        <p className="pointer-events-none fixed inset-x-0 bottom-5 z-10 animate-pulse text-center font-mono text-[10px] font-medium tracking-[0.26em] text-white sm:bottom-7 sm:text-xs">
          CLICK TO ENTER · {countdown}
        </p>
      )}
      {galleryVisible && <PortfolioGallery />}
    </main>
  )
}

export default App
