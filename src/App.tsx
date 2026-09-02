import { useEffect, useState } from "react"
import { SparkBadge } from "@/components/ui/spark-badge"
import { StarsCanvas } from "@/components/ui/stars-canvas"

// The scene is served as an independent iframe. A per-page-load token prevents
// GitHub Pages/CDN from showing a stale scene after an authored HTML update.
const sourceUrl = `${import.meta.env.BASE_URL}spark-badge.html?v=${Date.now()}`

function App() {
  const [promptActive, setPromptActive] = useState(false)

  useEffect(() => {
    let resetTimer: number | undefined
    const activatePrompt = () => {
      setPromptActive(true)
      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(() => setPromptActive(false), 760)
    }
    window.addEventListener("keydown", activatePrompt)
    window.addEventListener("pointerdown", activatePrompt)
    return () => {
      window.clearTimeout(resetTimer)
      window.removeEventListener("keydown", activatePrompt)
      window.removeEventListener("pointerdown", activatePrompt)
    }
  }, [])

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <StarsCanvas maxStars={1050} hue={217} brightness={0.9} speedMultiplier={0.8} className="z-0" />
      <SparkBadge
        sourceUrl={sourceUrl}
        className="relative z-[1] block h-full w-full overflow-hidden [&_.spark-badge__frame]:h-full [&_.spark-badge__frame]:w-full [&_.spark-badge__frame]:border-0 [&_.spark-badge__frame]:opacity-0 [&_.spark-badge__frame.is-ready]:opacity-100 [&_.spark-badge__frame]:transition-opacity"
      />
      <p
        className={`pointer-events-none fixed inset-x-0 bottom-5 z-10 text-center font-mono text-[10px] font-medium tracking-[0.26em] transition-all duration-200 sm:bottom-7 sm:text-xs ${
          promptActive ? "scale-110 text-blue-300 drop-shadow-[0_0_10px_rgba(96,165,250,0.9)]" : "animate-pulse text-white/80"
        }`}
      >
        {promptActive ? "PORTFOLIO ACCESS READY" : "PRESS ANY KEY"}
      </p>
    </main>
  )
}

export default App
