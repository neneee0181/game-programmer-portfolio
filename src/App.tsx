import { useState } from 'react'
import './App.css'

type Project = { id: string; index: string; title: string; type: string; summary: string; stack: string[]; highlights: string[]; github: string; video?: string; accent: string }

const projects: Project[] = [
  { id: 'kart-rider', index: '01', title: 'KARTRIDER', type: 'OpenGL Team Project', summary: 'C++와 OpenGL 기반으로 게임 플레이를 구현한 팀 프로젝트입니다.', stack: ['C++', 'OpenGL', 'Game Programming'], highlights: ['게임 플레이 경험을 구성한 팀 프로젝트', '실행 영상과 저장소로 결과를 확인할 수 있도록 정리 예정'], github: 'https://github.com/neneee0181/KartRider', video: 'https://youtu.be/FTfmZc3j5fU?si=Knz2sXl-UROgJgys', accent: 'coral' },
  { id: 'inversus', index: '02', title: 'INVERSUS', type: 'C++ / Win32 Personal Project', summary: 'C++와 Win32 API로 제작한 2D 슈팅 게임 개인 프로젝트입니다.', stack: ['C++', 'Win32 API', '2D Game'], highlights: ['개인 구현 프로젝트', '게임 루프·입력·상태 관리를 코드 중심으로 설명 예정'], github: 'https://github.com/kevin0181/INVERSUS', accent: 'lime' },
  { id: 'readapt', index: '03', title: 'RE:ADAPT', type: 'UE5 Graduation Team Project', summary: 'Unreal Engine 5 기반 TPS 로그라이크 졸업 팀 프로젝트입니다.', stack: ['Unreal Engine 5', 'C++', 'Team Development'], highlights: ['졸업작품 팀 개발 경험', '담당 기능과 기여도는 코드·문서 근거와 함께 구체화 예정'], github: 'https://github.com/zhaominn/Readapt_Project', accent: 'violet' },
]

function ArrowIcon() { return <span aria-hidden="true" className="arrow">↗</span> }

function App() {
  const [selectedId, setSelectedId] = useState(projects[0].id)
  const selected = projects.find((project) => project.id === selectedId) ?? projects[0]
  const scrollToProjects = () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })

  return <main>
    <div className="noise" aria-hidden="true" />
    <nav className="nav" aria-label="주요 탐색"><a className="wordmark" href="#top">YB<span>_</span>GAME</a><button type="button" onClick={scrollToProjects}>PROJECTS <span>03</span></button><a href="https://github.com/neneee0181" target="_blank" rel="noreferrer">GITHUB <ArrowIcon /></a></nav>
    <section id="top" className="hero-section"><div className="eyebrow"><span className="live-dot" /> GAME PROGRAMMER PORTFOLIO · 2026</div><div className="hero-copy"><p className="kicker">BUILDING PLAYABLE<br />SYSTEMS, ONE LOOP<br />AT A TIME.</p><h1>유영빈<span className="period">.</span></h1></div><div className="hero-footer"><p>GAME CLIENT PROGRAMMER<br />KOREA POLYTECHNIC UNIVERSITY</p><button className="scroll-prompt" type="button" onClick={scrollToProjects} aria-label="프로젝트 보기"><span>SCROLL TO EXPLORE</span><i aria-hidden="true">↓</i></button></div></section>
    <section id="projects" className="projects-section" aria-labelledby="projects-title"><div className="section-heading"><p className="eyebrow">SELECTED WORKS</p><h2 id="projects-title">PROJECT<br /><em>ARCHIVE</em></h2><p className="section-note">카드를 선택하면 각 프로젝트의<br />개발 맥락과 링크를 확인할 수 있습니다.</p></div><div className="project-layout"><div className="project-list" role="tablist" aria-label="프로젝트 목록">{projects.map((project) => <button key={project.id} type="button" role="tab" aria-selected={selected.id === project.id} className={`project-row ${selected.id === project.id ? 'active' : ''}`} onClick={() => setSelectedId(project.id)}><span className="project-index">{project.index}</span><span className="project-title">{project.title}</span><span className="project-type">{project.type}</span><ArrowIcon /></button>)}</div><article className={`project-detail ${selected.accent}`} role="tabpanel" aria-live="polite"><div className="detail-topline"><span>SELECTED / {selected.index}</span><span>{selected.type}</span></div><div className="detail-orb" aria-hidden="true"><span>{selected.index}</span></div><h3>{selected.title}</h3><p className="detail-summary">{selected.summary}</p><div className="detail-grid"><div><p className="label">TECH</p><ul className="tags">{selected.stack.map((item) => <li key={item}>{item}</li>)}</ul></div><div><p className="label">PORTFOLIO FOCUS</p><ul className="highlights">{selected.highlights.map((item) => <li key={item}>{item}</li>)}</ul></div></div><div className="detail-links"><a href={selected.github} target="_blank" rel="noreferrer">VIEW SOURCE <ArrowIcon /></a>{selected.video && <a href={selected.video} target="_blank" rel="noreferrer">WATCH DEMO <ArrowIcon /></a>}</div></article></div></section>
    <section className="closing-section"><p className="eyebrow">NEXT MISSION</p><h2>PLAY. TEST.<br /><em>ITERATE.</em></h2><p className="contact-link">PORTFOLIO IN PROGRESS</p><p className="footnote">프로젝트별 담당 기능·트러블슈팅·기여도는<br />검증 가능한 코드와 자료를 기준으로 순차 보강합니다.</p></section>
  </main>
}
export default App
