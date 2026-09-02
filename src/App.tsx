import { SparkBadge } from "@/components/ui/spark-badge"

// Keep the independently loaded iframe from reusing an older GitHub Pages/CDN
// response after the authored scene changes.
const sourceUrl = `${import.meta.env.BASE_URL}spark-badge.html?v=20260902-0615`

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
