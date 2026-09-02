import { SparkBadge } from "@/components/ui/spark-badge"

// The scene is served as an independent iframe. A per-page-load token prevents
// GitHub Pages/CDN from showing a stale scene after an authored HTML update.
const sourceUrl = `${import.meta.env.BASE_URL}spark-badge.html?v=${Date.now()}`

function App() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <SparkBadge
        sourceUrl={sourceUrl}
        className="block h-full w-full overflow-hidden bg-black [&_.spark-badge__frame]:h-full [&_.spark-badge__frame]:w-full [&_.spark-badge__frame]:border-0 [&_.spark-badge__frame]:opacity-0 [&_.spark-badge__frame.is-ready]:opacity-100 [&_.spark-badge__frame]:transition-opacity"
      />
    </main>
  )
}

export default App
