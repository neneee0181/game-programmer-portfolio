import { ArrowDownRight, ArrowUpRight, CodeXml, Radio } from "lucide-react"
import { SparkBadge } from "@/components/ui/spark-badge"

const projects = [
  { number: "01", name: "KARTRIDER", type: "C++ / OPENGL", href: "https://github.com/neneee0181/KartRider" },
  { number: "02", name: "INVERSUS", type: "C++ / WIN32", href: "https://github.com/kevin0181/INVERSUS" },
  { number: "03", name: "RE:ADAPT", type: "UNREAL ENGINE 5", href: "https://github.com/zhaominn/Readapt_Project" },
]

function App() {
  return <main className="spark-page min-h-screen overflow-hidden bg-[#08090d] text-[#eceeea] selection:bg-[#45ffd2] selection:text-black">
    <div className="pointer-events-none fixed inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:48px_48px]" />
    <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-5 py-5 sm:px-9 sm:py-8">
      <header className="flex items-center justify-between border-b border-white/15 pb-5 font-mono text-[10px] tracking-[.16em] sm:text-xs"><span>YB//GAME [ PORTFOLIO_2026 ]</span><div className="flex items-center gap-4"><span className="hidden text-[#45ffd2] sm:inline">SYSTEM: ONLINE</span><a className="flex items-center gap-1.5 transition hover:text-[#45ffd2]" href="https://github.com/neneee0181" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight className="size-3" /></a></div></header>
      <section className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1.1fr_.9fr] lg:py-16">
        <div className="relative z-10"><p className="mb-6 flex items-center gap-2 font-mono text-[10px] tracking-[.2em] text-[#45ffd2]"><Radio className="size-3 animate-pulse" /> GAME CLIENT PROGRAMMER</p><h1 className="max-w-4xl text-[clamp(3.6rem,9vw,9rem)] font-semibold leading-[.78] tracking-[-.1em]">MAKE<br /><span className="text-transparent [-webkit-text-stroke:1px_#eceeea]">PLAY</span><span className="text-[#ff5cc9]">ABLE.</span></h1><p className="mt-9 max-w-md text-sm leading-7 text-white/60 sm:text-base">게임이 의도한 경험을 실제 플레이로 옮기는 클라이언트 프로그래머. 구현·실행·검증의 기록을 프로젝트 단위로 남깁니다.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#works" className="inline-flex items-center gap-2 bg-[#45ffd2] px-4 py-3 font-mono text-xs font-bold tracking-[.12em] text-black transition hover:bg-white">VIEW WORKS <ArrowDownRight className="size-4" /></a><a href="https://github.com/neneee0181" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/25 px-4 py-3 font-mono text-xs tracking-[.12em] transition hover:border-[#ff5cc9] hover:text-[#ff5cc9]"><CodeXml className="size-4" /> GITHUB</a></div></div>
        <div className="relative mx-auto w-full max-w-[470px]"><div className="absolute inset-4 -z-10 bg-[#ff5cc9]/20 blur-3xl" /><SparkBadge className="block aspect-square w-full overflow-hidden border border-white/15 bg-black shadow-[0_0_80px_rgba(69,255,210,.12)] [&_.spark-badge__frame]:h-full [&_.spark-badge__frame]:w-full [&_.spark-badge__frame]:border-0 [&_.spark-badge__frame]:opacity-0 [&_.spark-badge__frame.is-ready]:opacity-100 [&_.spark-badge__frame]:transition-opacity" /><p className="mt-3 text-right font-mono text-[10px] tracking-[.14em] text-white/35">IDENTITY BADGE / ACTIVE</p></div>
      </section>
      <section id="works" className="border-t border-white/15 pt-5"><div className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-[.16em] text-white/55"><span>SELECTED PROJECTS</span><span>03 RECORDS</span></div><div className="grid border-l border-t border-white/15 md:grid-cols-3">{projects.map((project) => <a key={project.number} href={project.href} target="_blank" rel="noreferrer" className="group min-h-44 border-b border-r border-white/15 p-5 transition hover:bg-[#12151d]"><div className="flex justify-between font-mono text-[10px] text-[#45ffd2]"><span>{project.number}</span><CodeXml className="size-4 opacity-0 transition group-hover:opacity-100" /></div><h2 className="mt-11 text-2xl font-medium tracking-[-.06em] group-hover:text-[#ff5cc9]">{project.name}</h2><p className="mt-1 font-mono text-[10px] tracking-[.12em] text-white/40">{project.type}</p></a>)}</div></section>
      <footer className="flex justify-between pt-7 font-mono text-[10px] tracking-[.12em] text-white/35"><span>YOUNG BIN / 2026</span><span>BUILD · TEST · ITERATE</span></footer>
    </div>
  </main>
}
export default App
