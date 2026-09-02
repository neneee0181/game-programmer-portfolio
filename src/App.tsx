import { useCallback, useEffect, useState, type ReactNode } from "react"
import { ArrowUpRight, CodeXml, Play, Rotate3D, X } from "lucide-react"

import EnvironmentMap from "@/components/ui/environment-map"
import type { PortfolioFace } from "@/components/ui/environment-map-utils/renderer"
import { Button } from "@/components/ui/button"

type Detail = {
  label: string; title: string; subtitle: string; description: string
  stack: string[]; github?: string; video?: string; note: string
}

const details: Record<PortfolioFace, Detail> = {
  profile: {
    label: "PLAYER PROFILE", title: "유영빈", subtitle: "GAME CLIENT PROGRAMMER",
    description: "플레이 가능한 시스템을 직접 구현하고, 실행 결과와 코드로 설명하는 게임 클라이언트 프로그래머를 목표로 합니다.",
    stack: ["C++", "Unreal Engine", "OpenGL", "Win32 API"],
    note: "KOREA POLYTECHNIC UNIVERSITY · GAME ENGINEERING",
  },
  "kart-rider": {
    label: "PROJECT 01", title: "KartRider", subtitle: "C++ · OPENGL · TEAM PROJECT",
    description: "OpenGL 기반 팀 게임 프로젝트입니다. 실제 구동 영상과 공개 저장소를 통해 프로젝트 결과를 확인할 수 있습니다.",
    stack: ["C++", "OpenGL", "Game Programming"],
    github: "https://github.com/neneee0181/KartRider",
    video: "https://youtu.be/FTfmZc3j5fU?si=Knz2sXl-UROgJgys",
    note: "개인 담당 기능과 구현 근거를 기준으로 상세 내용을 보강 중입니다.",
  },
  inversus: {
    label: "PROJECT 02", title: "INVERSUS", subtitle: "C++ · WIN32 · PERSONAL PROJECT",
    description: "C++와 Win32 API로 제작한 2D 슈팅 게임 개인 프로젝트입니다. 게임 루프·입력·상태 관리를 코드 중심으로 확인할 수 있습니다.",
    stack: ["C++", "Win32 API", "2D Game"],
    github: "https://github.com/kevin0181/INVERSUS",
    note: "개인 구현 프로젝트 · 대표 코드와 트러블슈팅을 추가 정리 중입니다.",
  },
  readapt: {
    label: "PROJECT 03", title: "Re:adapt", subtitle: "UNREAL ENGINE 5 · GRADUATION PROJECT",
    description: "Unreal Engine 5 기반 TPS 로그라이크 졸업 팀 프로젝트입니다. 팀 프로젝트인 만큼 개인 기여는 검증 가능한 코드와 문서 기준으로 설명합니다.",
    stack: ["Unreal Engine 5", "C++", "Team Development"],
    github: "https://github.com/zhaominn/Readapt_Project",
    note: "개인 담당 기능·역할·문제 해결 과정을 근거 기반으로 보강 중입니다.",
  },
}

function ProjectLink({ href, children, outline = false }: { href: string; children: ReactNode; outline?: boolean }) {
  return <a href={href} target="_blank" rel="noreferrer" className={outline ? "inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10" : "inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-black transition hover:bg-white/85"}>{children}</a>
}

function App() {
  const [selected, setSelected] = useState<PortfolioFace | null>(null)
  const detail = selected ? details[selected] : null
  const selectFace = useCallback((face: PortfolioFace) => setSelected(face), [])

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null)
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [])

  return <main className="dark min-h-screen overflow-hidden bg-[#050609] text-white">
    <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8">
      <a href="#top" className="font-mono text-xs font-medium tracking-[0.18em] text-white/90">YB_GAME / 2026</a>
      <a href="https://github.com/neneee0181" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-white/55 transition hover:text-white">GITHUB <ArrowUpRight className="size-3.5" /></a>
    </div>
    <section id="top" className="relative h-screen min-h-[680px]">
      <EnvironmentMap onFaceSelect={selectFace} />
      <div className="pointer-events-none absolute inset-x-0 bottom-16 z-10 px-5 sm:bottom-10 sm:px-8">
        <div className="flex items-end justify-between gap-5">
          <div><p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-[#b6ff37]">INTERACTIVE PORTFOLIO</p><h1 className="text-balance text-4xl font-semibold tracking-[-0.075em] sm:text-6xl">Rotate the cube.<br />Open a story.</h1></div>
          <div className="hidden items-center gap-2 pb-1 font-mono text-[10px] tracking-[0.12em] text-white/45 sm:flex"><Rotate3D className="size-4" /> DRAG / CLICK</div>
        </div>
      </div>
    </section>
    {detail && <div className="fixed inset-0 z-30 flex items-end bg-black/55 p-3 backdrop-blur-sm sm:items-center sm:justify-end sm:p-6" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={() => setSelected(null)}>
      <article className="max-h-[92svh] w-full overflow-auto border border-white/15 bg-[#101319]/95 p-6 shadow-2xl shadow-black/60 sm:max-w-xl sm:p-9" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-16 flex items-start justify-between gap-5"><p className="font-mono text-[10px] tracking-[0.17em] text-[#b6ff37]">{detail.label}</p><Button variant="ghost" size="icon" onClick={() => setSelected(null)} aria-label="상세 창 닫기"><X className="size-5" /></Button></div>
        <p className="mb-3 font-mono text-[11px] tracking-[0.14em] text-white/45">{detail.subtitle}</p>
        <h2 id="detail-title" className="text-5xl font-semibold tracking-[-0.08em] sm:text-6xl">{detail.title}</h2>
        <p className="mt-7 text-pretty text-[15px] leading-7 text-white/75">{detail.description}</p>
        <div className="mt-9 border-y border-white/10 py-6"><p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-white/40">TECH</p><div className="flex flex-wrap gap-2">{detail.stack.map((item) => <span key={item} className="border border-white/15 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.08em] text-white/75">{item}</span>)}</div></div>
        <p className="mt-6 font-mono text-xs leading-5 text-white/45">{detail.note}</p>
        {(detail.github || detail.video) && <div className="mt-9 flex flex-wrap gap-2">
          {detail.github && <ProjectLink href={detail.github}><CodeXml className="size-4" /> VIEW SOURCE</ProjectLink>}
          {detail.video && <ProjectLink href={detail.video} outline><Play className="size-4" /> WATCH DEMO</ProjectLink>}
        </div>}
      </article>
    </div>}
  </main>
}

export default App
