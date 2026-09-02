import { ArrowDown, Expand, Mouse, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SparkBadge } from "@/components/ui/spark-badge"
import { StarsCanvas } from "@/components/ui/stars-canvas"

// The scene is served as an independent iframe. A per-page-load token prevents
// GitHub Pages/CDN from showing a stale scene after an authored HTML update.
const sourceUrl = `${import.meta.env.BASE_URL}spark-badge.html?v=${Date.now()}`

const details = [
  { title: "이정현", eyebrow: "PROFILE / RESUME", text: "게임의 움직임과 상호작용을 코드로 설계하는 게임 클라이언트 프로그래머 지망생입니다.", stack: "C++ · Unreal Engine 5 · OpenGL" },
  { title: "KartRider", eyebrow: "GAME PROJECT / 01", text: "C++와 OpenGL을 바탕으로 구현한 레이싱 게임 프로젝트입니다. 게임 루프와 렌더링 구조를 직접 다루며 플레이 감각과 화면 표현을 연결했습니다.", stack: "C++ · OpenGL · Game Client" },
  { title: "INVERSUS", eyebrow: "GAME PROJECT / 02", text: "C++와 Win32 기반으로 게임 플레이를 구현한 프로젝트입니다. 입력, 상태 변화, 화면 표현이 연결되는 게임 클라이언트 흐름에 집중했습니다.", stack: "C++ · Win32 · Game Client" },
  { title: "Re:adapt", eyebrow: "GRADUATION PROJECT / 03", text: "Unreal Engine 5로 제작한 졸업 작품입니다. 기획 의도를 실제 플레이 가능한 경험으로 연결하는 구현 과정을 다뤘습니다.", stack: "Unreal Engine 5 · Blueprint · Game Design" },
]

function App() {
  const [countdown, setCountdown] = useState(5)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const wheelLock = useRef(false)

  useEffect(() => {
    const openGallery = () => setGalleryOpen(true)
    const receiveIframeClick = (event: MessageEvent) => {
      if (event.data?.type === "spark-badge-enter") openGallery()
      if (event.data?.type === "spark-badge-gallery-select" && Number.isInteger(event.data.index)) {
        setSelectedIndex(event.data.index)
      }
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

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <StarsCanvas maxStars={1050} hue={217} brightness={0.9} speedMultiplier={0.8} className="z-0" />
      <SparkBadge
        sourceUrl={sourceUrl}
        variant={galleryOpen ? "gallery" : "badge"}
        galleryIndex={galleryIndex}
        className="relative z-[1] block h-full w-full overflow-hidden [&_.spark-badge__frame]:h-full [&_.spark-badge__frame]:w-full [&_.spark-badge__frame]:border-0 [&_.spark-badge__frame]:opacity-0 [&_.spark-badge__frame.is-ready]:opacity-100 [&_.spark-badge__frame]:transition-opacity"
      />
      {galleryOpen && selectedIndex === null && (
        <div className="pointer-events-none fixed inset-0 z-[11] flex items-center justify-center text-white">
          <div className="flex h-[63vmin] w-[85vmin] flex-col justify-between py-[5vmin]">
            <div className="text-center">
              <p className="font-mono text-[10px] tracking-[0.24em] text-sky-200/85">{details[galleryIndex].eyebrow}</p>
              <h1 className="mt-7 text-5xl font-semibold tracking-tight sm:text-8xl">{details[galleryIndex].title}</h1>
              <p className="mx-auto mt-7 max-w-xl text-sm leading-6 text-white/70 sm:text-base">{details[galleryIndex].text}</p>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-3 border-t border-white/20 pt-4 font-mono text-[9px] tracking-[0.13em] text-white/70 sm:text-[10px] sm:tracking-[0.16em]">
              <span>{String(galleryIndex + 1).padStart(2, "0")} / 04</span>
              <div className="flex flex-wrap justify-end gap-x-3 gap-y-2 text-right sm:gap-x-5">
                <span className="flex items-center gap-2"><Mouse className="size-3.5 text-sky-300" /> SCROLL <ArrowDown className="size-3.5" /></span>
                <span className="flex items-center gap-2"><Expand className="size-3.5 text-sky-300" /> CLICK TO VIEW</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {!galleryOpen && (
        <p className="pointer-events-none fixed inset-x-0 bottom-5 z-10 animate-pulse text-center font-mono text-[10px] font-medium tracking-[0.26em] text-white sm:bottom-7 sm:text-xs">
          CLICK TO ENTER · {countdown}
        </p>
      )}
      {galleryOpen && selectedIndex === null && (
        <div
          className="fixed inset-0 z-10 cursor-pointer"
          onClick={() => setSelectedIndex(galleryIndex)}
          onWheel={(event) => {
            event.preventDefault()
            if (wheelLock.current || Math.abs(event.deltaY) < 24) return
            const direction = event.deltaY > 0 ? 1 : -1
            setGalleryIndex((value) => Math.max(0, Math.min(details.length - 1, value + direction)))
            wheelLock.current = true
            window.setTimeout(() => { wheelLock.current = false }, 2400)
          }}
        />
      )}
      {selectedIndex !== null && (
        <section className="fixed inset-0 z-20 overflow-y-auto bg-[#02040d]/95 px-5 py-5 text-white backdrop-blur-xl sm:px-10 sm:py-10">
          <article className="mx-auto flex min-h-full max-w-6xl flex-col rounded-[1.8rem] border border-white/20 bg-[#07101e] p-7 sm:rounded-[2.4rem] sm:p-12">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.23em] text-sky-200">
              <span>{details[selectedIndex].eyebrow}</span>
              <button type="button" aria-label="상세 탭 닫기" onClick={() => setSelectedIndex(null)} className="rounded-full border border-white/20 p-2 text-white/75 transition hover:border-white hover:text-white">
                <X className="size-5" />
              </button>
            </div>
            <div className="my-auto grid flex-1 gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="font-mono text-6xl font-light text-white/20">{String(selectedIndex + 1).padStart(2, "0")}</p>
                <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-8xl">{details[selectedIndex].title}</h1>
              </div>
              <div className="border-l border-white/15 pl-6 sm:pl-8">
                <p className="text-lg leading-8 text-white/75">{details[selectedIndex].text}</p>
                <p className="mt-8 font-mono text-xs tracking-[0.16em] text-sky-100">{details[selectedIndex].stack}</p>
              </div>
            </div>
            <p className="border-t border-white/15 pt-6 font-mono text-[10px] tracking-[0.2em] text-white/50">DETAIL VIEW / CLICK CLOSE TO RETURN</p>
          </article>
        </section>
      )}
    </main>
  )
}

export default App
