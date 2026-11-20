import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { hexA } from '../utils/color'

/**
 * Fully procedural laptop (no external assets).
 * Origin = centre of the base. Faces +Z. Base top is at y = 0.06.
 *
 * Props
 *  - accent: glow colour (keyboard backlight, screen, edge light)
 *  - lid:    0..1 number or a framer-motion MotionValue (0 = closed, 1 = open)
 */

const CLOSED_ANGLE = 0.03
const OPEN_ANGLE = 1.86 // ~106 degrees

/* ---------- keyboard layout (built once) ---------- */
function buildKeys() {
  const keys = []
  const pitch = 0.2
  const left = -1.4
  const z0 = -0.9
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 14; c += 1) {
      keys.push({ x: left + (c + 0.5) * pitch, z: z0 + r * 0.19, w: 1 })
    }
  }
  // bottom row with a long space bar
  let col = 0
  for (const w of [1, 1, 1, 1, 5, 1, 1, 1, 1, 1]) {
    keys.push({ x: left + (col + w / 2) * pitch, z: z0 + 4 * 0.19, w })
    col += w
  }
  return keys
}
const KEYS = buildKeys()

function Keys() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    KEYS.forEach((k, i) => {
      dummy.position.set(k.x, 0.0775, k.z)
      dummy.scale.set(k.w * 0.2 - 0.03, 0.035, 0.16)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, KEYS.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#0c0f16" roughness={0.55} metalness={0.4} />
    </instancedMesh>
  )
}

/* ---------- screen wallpaper drawn on a canvas ---------- */
function makeScreenTexture(accent) {
  const W = 1024
  const H = 648
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const g = canvas.getContext('2d')

  g.fillStyle = '#03050a'
  g.fillRect(0, 0, W, H)

  const blob = (x, y, r, color, a) => {
    const grad = g.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, hexA(color, a))
    grad.addColorStop(1, hexA(color, 0))
    g.fillStyle = grad
    g.fillRect(0, 0, W, H)
  }
  blob(260, 440, 460, accent, 0.8)
  blob(800, 190, 400, '#5b5bff', 0.55)
  blob(560, 600, 320, accent, 0.35)

  // flowing contour lines
  g.lineWidth = 1.5
  for (let i = 0; i < 24; i += 1) {
    g.strokeStyle = `rgba(255,255,255,${0.03 + i * 0.004})`
    g.beginPath()
    for (let x = 0; x <= W; x += 8) {
      const y = 250 + Math.sin(x * 0.008 + i * 0.35) * 70 + i * 8
      if (x === 0) g.moveTo(x, y)
      else g.lineTo(x, y)
    }
    g.stroke()
  }

  // wordmark
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = 'rgba(255,255,255,0.94)'
  g.font = '700 92px "Space Grotesk", Inter, sans-serif'
  if ('letterSpacing' in g) g.letterSpacing = '22px'
  g.fillText('NEXOGIL', W / 2 + 11, 285)
  g.fillStyle = accent
  g.font = '500 24px Inter, sans-serif'
  if ('letterSpacing' in g) g.letterSpacing = '10px'
  g.fillText('POWER BEYOND LIMITS', W / 2 + 5, 365)

  // dock
  g.fillStyle = 'rgba(255,255,255,0.1)'
  g.beginPath()
  g.roundRect(W / 2 - 150, H - 74, 300, 46, 23)
  g.fill()
  for (let i = 0; i < 5; i += 1) {
    g.fillStyle = i === 2 ? accent : 'rgba(255,255,255,0.35)'
    g.beginPath()
    g.arc(W / 2 - 100 + i * 50, H - 51, 11, 0, Math.PI * 2)
    g.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export default function LaptopModel({ accent = '#27d8ff', lid = 1, ...props }) {
  const lidRef = useRef(null)
  const current = useRef(0)
  const screenTex = useMemo(() => makeScreenTexture(accent), [accent])
  useEffect(() => () => screenTex.dispose(), [screenTex])

  useFrame((_, dt) => {
    const target = typeof lid === 'number' ? lid : lid.get()
    current.current = THREE.MathUtils.damp(current.current, target, 3.2, Math.min(dt, 0.05))
    if (lidRef.current) {
      lidRef.current.rotation.x = -THREE.MathUtils.lerp(CLOSED_ANGLE, OPEN_ANGLE, current.current)
    }
  })

  return (
    <group {...props}>
      {/* ---- base ---- */}
      <RoundedBox args={[3.2, 0.12, 2.2]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color="#2b303b" metalness={0.92} roughness={0.34} />
      </RoundedBox>

      {/* keyboard backlight + keys */}
      <mesh position={[0, 0.0615, -0.52]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.9, 1.0]} />
        <meshBasicMaterial color={accent} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <Keys />

      {/* trackpad */}
      <RoundedBox args={[1.15, 0.012, 0.62]} radius={0.02} smoothness={3} position={[0, 0.062, 0.68]}>
        <meshStandardMaterial color="#1a1e27" metalness={0.55} roughness={0.25} />
      </RoundedBox>

      {/* front edge light strip */}
      <mesh position={[0, 0.0, 1.101]}>
        <boxGeometry args={[2.2, 0.01, 0.01]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>

      {/* hinge */}
      <mesh position={[0, 0.09, -1.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 2.5, 24]} />
        <meshStandardMaterial color="#12151c" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* ---- lid ---- */}
      <group ref={lidRef} position={[0, 0.1, -1.08]}>
        <RoundedBox args={[3.2, 0.08, 2.1]} radius={0.03} smoothness={4} position={[0, 0.045, 1.05]}>
          <meshStandardMaterial color="#3a4150" metalness={1} roughness={0.28} />
        </RoundedBox>

        {/* bezel (faces the user when open) */}
        <mesh position={[0, 0.003, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.14, 2.02]} />
          <meshBasicMaterial color="#020306" />
        </mesh>
        {/* screen */}
        <mesh position={[0, 0.001, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.96, 1.85]} />
          <meshBasicMaterial map={screenTex} toneMapped={false} />
        </mesh>

        {/* glowing emblem on the outer lid */}
        <mesh position={[0, 0.0855, 1.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.235, 48]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.0855, 1.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.07, 32]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
