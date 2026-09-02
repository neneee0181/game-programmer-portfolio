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

function makeCloudTexture() {
  const cloudCanvas = document.createElement("canvas")
  cloudCanvas.width = 512
  cloudCanvas.height = 220
  const context = cloudCanvas.getContext("2d")
  if (!context) return new THREE.CanvasTexture(cloudCanvas)
  for (const [x, y, radius] of [[112, 126, 72], [194, 95, 95], [294, 102, 110], [384, 132, 68]] as const) {
    const cloud = context.createRadialGradient(x, y, radius * 0.08, x, y, radius)
    cloud.addColorStop(0, "rgba(255,255,255,0.62)")
    cloud.addColorStop(0.45, "rgba(255,255,255,0.35)")
    cloud.addColorStop(1, "rgba(255,255,255,0)")
    context.fillStyle = cloud
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  }
  const texture = new THREE.CanvasTexture(cloudCanvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createRenderer({ canvas, onFaceSelect }: RendererOptions) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color("#91b6d7")
  scene.fog = new THREE.Fog("#b9cce0", 18, 58)
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120)
  camera.position.set(0, 2.4, 11.5)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(80, 32, 16),
    new THREE.MeshBasicMaterial({ color: "#a7c8e5", side: THREE.BackSide }),
  )
  scene.add(sky)
  const horizon = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 70),
    new THREE.MeshBasicMaterial({ color: "#d4e2ee", transparent: true, opacity: 0.38, depthWrite: false }),
  )
  horizon.position.set(0, 8, -38)
  scene.add(horizon)
  const cloudTexture = makeCloudTexture()
  const cloudMaterial = new THREE.SpriteMaterial({ map: cloudTexture, transparent: true, opacity: 0.55, depthWrite: false, fog: false })
  const clouds = [
    [-10, 3.4, -13, 8, 3.2], [-3, 5.2, -17, 10, 3.6], [5.5, 3.8, -15, 8.8, 3], [13, 5.7, -22, 12, 4],
  ].map(([x, y, z, width, height]) => {
    const cloud = new THREE.Sprite(cloudMaterial)
    cloud.position.set(x, y, z)
    cloud.scale.set(width, height, 1)
    scene.add(cloud)
    return cloud
  })
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 24, 24),
    new THREE.MeshBasicMaterial({ color: "#fff9d6", fog: false }),
  )
  sun.position.set(8.2, 3.6, -13)
  scene.add(sun)
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTexture, color: "#fff6c7", transparent: true, opacity: 0.58, depthWrite: false, fog: false }))
  sunGlow.position.copy(sun.position)
  sunGlow.scale.set(5, 3.2, 1)
  scene.add(sunGlow)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 140),
    new THREE.MeshStandardMaterial({ color: "#526b82", roughness: 0.95, metalness: 0.02 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -2.8
  scene.add(ground)
  const grid = new THREE.GridHelper(130, 90, "#7f9db4", "#5c778f")
  grid.position.y = -2.77
  grid.material.transparent = true
  grid.material.opacity = 0.78
  scene.add(grid)

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2.85, 2.85, 2.85),
    faces.map((face) => new THREE.MeshStandardMaterial({ map: makeTexture(face), roughness: 0.46, metalness: 0.18 })),
  )
  cube.position.y = -0.25
  cube.rotation.set(-0.24, 0.6, 0.02)
  scene.add(cube)
  scene.add(new THREE.HemisphereLight("#dceeff", "#52677c", 2.6))
  const keyLight = new THREE.DirectionalLight("#fff5cf", 3.2)
  keyLight.position.set(10, 14, 8)
  scene.add(keyLight)
  const rimLight = new THREE.PointLight("#b9d4ff", 22, 20)
  rimLight.position.set(-4, 3, 5)
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
    camera.lookAt(0, -0.35, 0)
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
      sky.geometry.dispose()
      ;(sky.material as THREE.Material).dispose()
      horizon.geometry.dispose()
      ;(horizon.material as THREE.Material).dispose()
      ground.geometry.dispose()
      ;(ground.material as THREE.Material).dispose()
      ;(grid.material as THREE.Material).dispose()
      sun.geometry.dispose()
      ;(sun.material as THREE.Material).dispose()
      cloudMaterial.dispose()
      sunGlow.material.dispose()
      cloudTexture.dispose()
      clouds.length = 0
      renderer.dispose()
    },
  }
}
