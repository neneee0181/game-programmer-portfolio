import * as THREE from "three"

export type PortfolioFace = "profile" | "kart-rider" | "inversus" | "readapt"

type RendererOptions = {
  canvas: HTMLCanvasElement
  onFaceSelect?: (face: PortfolioFace) => void
}

type FaceSpec = {
  id: PortfolioFace | "systems" | "contact"
  eyebrow: string
  title: string
  subtitle: string
  color: string
}

const faces: FaceSpec[] = [
  { id: "profile", eyebrow: "PLAYER 01", title: "YOUNG BIN", subtitle: "GAME CLIENT PROGRAMMER", color: "#b6ff37" },
  { id: "kart-rider", eyebrow: "PROJECT 01", title: "KARTRIDER", subtitle: "C++ · OPENGL", color: "#ff704f" },
  { id: "inversus", eyebrow: "PROJECT 02", title: "INVERSUS", subtitle: "C++ · WIN32", color: "#74a7ff" },
  { id: "readapt", eyebrow: "PROJECT 03", title: "RE:ADAPT", subtitle: "UE5 · GRADUATION", color: "#c698ff" },
  { id: "systems", eyebrow: "CORE", title: "BUILD", subtitle: "PLAY · TEST · ITERATE", color: "#ffe84a" },
  { id: "contact", eyebrow: "STATUS", title: "2026", subtitle: "NEXON TUTORIAL", color: "#ffffff" },
]

function makeTexture(face: FaceSpec) {
  const textureCanvas = document.createElement("canvas")
  textureCanvas.width = 1024
  textureCanvas.height = 1024
  const context = textureCanvas.getContext("2d")
  if (!context) return new THREE.CanvasTexture(textureCanvas)

  const gradient = context.createLinearGradient(0, 0, 1024, 1024)
  gradient.addColorStop(0, "#15181d")
  gradient.addColorStop(1, "#06070a")
  context.fillStyle = gradient
  context.fillRect(0, 0, 1024, 1024)
  context.strokeStyle = `${face.color}66`
  context.lineWidth = 3
  context.strokeRect(42, 42, 940, 940)
  context.strokeStyle = "#ffffff18"
  context.lineWidth = 1
  for (let line = 100; line < 960; line += 96) {
    context.beginPath()
    context.moveTo(50, line)
    context.lineTo(974, line)
    context.stroke()
  }
  context.fillStyle = face.color
  context.beginPath()
  context.arc(118, 118, 22, 0, Math.PI * 2)
  context.fill()
  context.font = "500 34px monospace"
  context.fillStyle = "#d7dde6"
  context.fillText(face.eyebrow, 162, 130)
  context.font = "700 110px Arial"
  context.fillStyle = "#f5f7fb"
  const titleLines = face.title.split(" ")
  titleLines.forEach((line, index) => context.fillText(line, 78, 610 + index * 116))
  context.font = "500 31px monospace"
  context.fillStyle = face.color
  context.fillText(face.subtitle, 80, 875)
  context.font = "500 24px monospace"
  context.fillStyle = "#9fa8b5"
  context.fillText("CLICK TO OPEN", 80, 935)
  context.strokeStyle = face.color
  context.lineWidth = 12
  context.beginPath()
  context.moveTo(80, 760)
  context.lineTo(410, 760)
  context.stroke()
  const texture = new THREE.CanvasTexture(textureCanvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export function createRenderer({ canvas, onFaceSelect }: RendererOptions) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color("#050609")
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
  camera.position.set(0, 0, 8)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(3.65, 3.65, 3.65),
    faces.map((face) => new THREE.MeshStandardMaterial({ map: makeTexture(face), roughness: 0.58, metalness: 0.26 })),
  )
  cube.rotation.set(-0.28, 0.58, 0.02)
  scene.add(cube)
  scene.add(new THREE.AmbientLight("#9fb0cb", 1.65))
  const keyLight = new THREE.DirectionalLight("#e6ffe3", 2.7)
  keyLight.position.set(4, 5, 7)
  scene.add(keyLight)
  const rimLight = new THREE.PointLight("#8c6cff", 26, 20)
  rimLight.position.set(-5, -3, 2)
  scene.add(rimLight)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let frame = 0
  let disposed = false
  let dragging = false
  let moved = false
  let startX = 0
  let startY = 0
  let targetX = cube.rotation.x
  let targetY = cube.rotation.y

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  const pickFace = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObject(cube)[0]
    const materialIndex = hit?.face?.materialIndex
    if (materialIndex === undefined) return
    const id = faces[materialIndex]?.id
    if (id === "profile" || id === "kart-rider" || id === "inversus" || id === "readapt") onFaceSelect?.(id)
  }

  const onPointerDown = (event: PointerEvent) => {
    dragging = true
    moved = false
    startX = event.clientX
    startY = event.clientY
    canvas.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY
    if (Math.abs(deltaX) + Math.abs(deltaY) > 4) moved = true
    targetY += deltaX * 0.009
    targetX += deltaY * 0.009
    startX = event.clientX
    startY = event.clientY
  }
  const onPointerUp = (event: PointerEvent) => {
    dragging = false
    if (!moved) pickFace(event)
    canvas.releasePointerCapture(event.pointerId)
  }
  const onPointerLeave = () => { dragging = false }

  canvas.addEventListener("pointerdown", onPointerDown)
  canvas.addEventListener("pointermove", onPointerMove)
  canvas.addEventListener("pointerup", onPointerUp)
  canvas.addEventListener("pointerleave", onPointerLeave)
  window.addEventListener("resize", resize)
  resize()

  const render = () => {
    if (disposed) return
    frame = requestAnimationFrame(render)
    if (!dragging) targetY += 0.0016
    cube.rotation.x += (targetX - cube.rotation.x) * 0.08
    cube.rotation.y += (targetY - cube.rotation.y) * 0.08
    renderer.render(scene, camera)
  }
  render()

  return {
    ready: Promise.resolve(),
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointermove", onPointerMove)
      canvas.removeEventListener("pointerup", onPointerUp)
      canvas.removeEventListener("pointerleave", onPointerLeave)
      cube.geometry.dispose()
      for (const material of cube.material) {
        material.map?.dispose()
        material.dispose()
      }
      renderer.dispose()
    },
  }
}
