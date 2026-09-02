import { ArrowUpRight, ChevronRight, Code2, FileText, Gamepad2, X } from "lucide-react"
import { useState } from "react"

type PortfolioItem = {
  id: string
  index: string
  eyebrow: string
  title: string
  summary: string
  stack: string[]
  details: string[]
  icon: typeof FileText
  accent: string
}

const items: PortfolioItem[] = [
  {
    id: "profile",
    index: "00",
    eyebrow: "PROFILE / RESUME",
    title: "이정현",
    summary: "게임의 움직임과 상호작용을 코드로 설계하는 게임 클라이언트 프로그래머 지망생입니다.",
    stack: ["C++", "Unreal Engine 5", "OpenGL"],
    details: [
      "게임공학 기반의 프로젝트 경험을 중심으로, 직접 구현한 결과와 문제 해결 과정을 포트폴리오에 정리합니다.",
      "렌더링, 게임플레이 구현, 엔진 활용과 클라이언트 구조에 흥미를 두고 성장하고 있습니다.",
    ],
    icon: FileText,
    accent: "from-sky-300/35 via-blue-500/10 to-transparent",
  },
  {
    id: "kartrider",
    index: "01",
    eyebrow: "GAME PROJECT / 01",
    title: "KartRider",
    summary: "C++와 OpenGL을 바탕으로 구현한 레이싱 게임 프로젝트입니다.",
    stack: ["C++", "OpenGL", "Game Client"],
    details: [
      "레이싱 게임의 핵심 흐름을 직접 구현하며 게임 루프와 렌더링 구조를 다뤘습니다.",
      "조작 감각과 화면 표현이 함께 맞물리는 클라이언트 구현 경험을 쌓은 프로젝트입니다.",
    ],
    icon: Gamepad2,
    accent: "from-cyan-300/35 via-sky-500/10 to-transparent",
  },
  {
    id: "inversus",
    index: "02",
    eyebrow: "GAME PROJECT / 02",
    title: "INVERSUS",
    summary: "C++와 Win32 기반으로 게임 플레이를 구현한 프로젝트입니다.",
    stack: ["C++", "Win32", "Game Client"],
    details: [
      "게임 규칙과 입력, 상태 변화가 화면에 연결되는 과정을 코드로 구성했습니다.",
      "제한된 환경에서도 플레이 경험을 완성하는 데 집중한 게임 클라이언트 작업입니다.",
    ],
    icon: Code2,
    accent: "from-violet-300/35 via-indigo-500/10 to-transparent",
  },
  {
    id: "readapt",
    index: "03",
    eyebrow: "GRADUATION PROJECT / 03",
    title: "Re:adapt",
    summary: "Unreal Engine 5로 제작한 졸업 작품 프로젝트입니다.",
    stack: ["Unreal Engine 5", "Blueprint", "Game Design"],
    details: [
      "졸업 작품을 완성하며 게임 콘텐츠를 구현하고, 플레이 흐름을 설계하는 경험을 축적했습니다.",
      "기획 의도를 플레이 가능한 결과로 연결하는 과정에 집중했습니다.",
    ],
    icon: Gamepad2,
    accent: "from-blue-300/35 via-indigo-500/10 to-transparent",
  },
]

export function PortfolioGallery() {
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  return (
    <section className="fixed inset-0 z-20 overflow-y-auto bg-[#02040d]/65 text-white backdrop-blur-[2px]">
      <div className="mx-auto min-h-full max-w-6xl px-5 pb-16 pt-8 sm:px-10 sm:pt-12">
        <header className="mb-12 flex items-end justify-between border-b border-white/15 pb-5 font-mono text-[10px] tracking-[0.22em] text-white/60 sm:mb-16">
          <span>LEE JEONG HYEON / GAME PROGRAMMER</span>
          <span className="hidden sm:block">SCROLL TO EXPLORE</span>
        </header>

        <div className="space-y-6 sm:space-y-10">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="group relative flex min-h-[64svh] w-full overflow-hidden rounded-[1.7rem] border border-white/20 bg-[#07101e]/78 p-7 text-left shadow-[0_0_80px_rgba(59,130,246,0.08)] transition duration-500 hover:-translate-y-1 hover:border-sky-200/65 hover:bg-[#09172a]/90 sm:min-h-[70svh] sm:rounded-[2.3rem] sm:p-12"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent} opacity-80`} />
                <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/15 transition duration-700 group-hover:scale-125" />
                <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(147,197,253,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,253,0.22)_1px,transparent_1px)] [background-size:42px_42px]" />

                <div className="relative flex w-full flex-col justify-between gap-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-sky-100/80">
                      <Icon className="size-4" strokeWidth={1.5} />
                      {item.eyebrow}
                    </div>
                    <span className="font-mono text-4xl font-light tracking-tighter text-white/35 sm:text-6xl">{item.index}</span>
                  </div>

                  <div className="max-w-3xl">
                    <h2 className="text-4xl font-semibold tracking-tight sm:text-7xl">{item.title}</h2>
                    <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">{item.summary}</p>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-5">
                    <div className="flex flex-wrap gap-2">
                      {item.stack.map((tech) => (
                        <span key={tech} className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-white/75">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-sky-100 transition group-hover:gap-4">
                      VIEW DETAIL <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-30 overflow-y-auto bg-[#02040d]/96 px-5 py-5 backdrop-blur-xl sm:px-10 sm:py-10">
          <article className="mx-auto flex min-h-full max-w-6xl flex-col rounded-[1.7rem] border border-white/20 bg-[#07101e] p-7 sm:rounded-[2.3rem] sm:p-12">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.24em] text-sky-200">{selected.eyebrow}</span>
              <button
                type="button"
                aria-label="상세 탭 닫기"
                onClick={() => setSelected(null)}
                className="rounded-full border border-white/20 p-2 text-white/80 transition hover:border-white hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="my-auto grid flex-1 gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <span className="font-mono text-6xl font-light text-white/20">{selected.index}</span>
                <h2 className="mt-5 text-5xl font-semibold tracking-tight sm:text-8xl">{selected.title}</h2>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75">{selected.summary}</p>
              </div>
              <div className="space-y-5 border-l border-white/15 pl-6 text-white/70 sm:pl-8">
                {selected.details.map((detail) => (
                  <p key={detail} className="leading-7">{detail}</p>
                ))}
                <div className="flex flex-wrap gap-2 pt-4">
                  {selected.stack.map((tech) => (
                    <span key={tech} className="rounded-full border border-sky-200/25 bg-sky-200/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-sky-100">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-white/15 pt-6 font-mono text-[10px] tracking-[0.2em] text-white/50">
              <ChevronRight className="size-4 text-sky-300" /> DETAIL VIEW / PORTFOLIO ARCHIVE
            </div>
          </article>
        </div>
      )}
    </section>
  )
}

export default PortfolioGallery
