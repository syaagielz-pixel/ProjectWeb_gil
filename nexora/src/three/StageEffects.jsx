import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

/* ---------------- lighting ---------------- */

/** Offline studio reflections (no HDR download) so the metal actually looks like metal. */
export function StudioEnvironment({ accent }) {
  return (
    <Environment key={accent} resolution={256} frames={1}>
      <color attach="background" args={['#05060a']} />
      <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 5, -6]} scale={[14, 3, 1]} />
      <Lightformer form="rect" intensity={3.2} color={accent} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
      <Lightformer form="rect" intensity={2.6} color="#4f6bff" position={[6, 2, -1]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
      <Lightformer form="ring" intensity={1.6} color="#ffffff" position={[0, 2, 7]} scale={4} />
    </Environment>
  )
}

export function StudioLights({ accent }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 6, 5]} intensity={1.3} color="#ffffff" />
      <pointLight position={[-5, 1.5, 3]} intensity={40} distance={14} color={accent} />
      <pointLight position={[5, 2, -4]} intensity={35} distance={14} color="#5b6bff" />
    </>
  )
}

/* ---------------- responsive placement ---------------- */

/**
 * Positions/scales its children so the laptop fits any aspect ratio:
 * right of centre on wide screens, lower-centre on phones (text sits above).
 */
export function ResponsiveStage({ children, dist = 6.4, fov = 38, wideShift = 0.22 }) {
  const size = useThree((s) => s.size)
  const aspect = size.width / size.height
  const visH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(fov / 2))
  const visW = visH * aspect
  const wide = size.width >= 1024

  const scale = wide
    ? Math.min(1.25, (visW * 0.5) / 3.4)
    : THREE.MathUtils.clamp((visW * 0.82) / 3.4, 0.5, 1.1)
  const position = wide ? [visW * wideShift, -0.1, 0] : [0, -visH * 0.2, 0]

  return (
    <group position={position} scale={scale}>
      {children}
    </group>
  )
}

/* ---------------- floor ---------------- */

function radialTexture(stops) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  stops.forEach(([o, color]) => grad.addColorStop(o, color))
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Glow pool, soft shadow and pulsing rings under the floating laptop. */
export function FloorStage({ accent, y = -1.25 }) {
  const ring = useRef(null)
  const glowTex = useMemo(
    () => radialTexture([[0, 'rgba(255,255,255,1)'], [0.4, 'rgba(255,255,255,0.35)'], [1, 'rgba(255,255,255,0)']]),
    [],
  )
  const shadowTex = useMemo(
    () => radialTexture([[0, 'rgba(0,0,0,0.85)'], [0.6, 'rgba(0,0,0,0.35)'], [1, 'rgba(0,0,0,0)']]),
    [],
  )

  useFrame(({ clock }) => {
    if (ring.current) ring.current.material.opacity = 0.38 + Math.sin(clock.elapsedTime * 1.6) * 0.12
  })

  return (
    <group position={[0, y, 0]} rotation-x={-Math.PI / 2}>
      <mesh renderOrder={0} position={[0, 0, 0.002]}>
        <planeGeometry args={[9, 9]} />
        <meshBasicMaterial map={glowTex} color={accent} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh renderOrder={1} position={[0, 0, 0.004]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
      <mesh ref={ring} renderOrder={2} position={[0, 0, 0.006]}>
        <ringGeometry args={[2.1, 2.14, 128]} />
        <meshBasicMaterial color={accent} transparent opacity={0.4} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh renderOrder={2} position={[0, 0, 0.006]}>
        <ringGeometry args={[3.1, 3.12, 128]} />
        <meshBasicMaterial color={accent} transparent opacity={0.15} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ---------------- abstract geometry ---------------- */

const SHAPES = [
  { type: 'ico', p: [-5, 2.2, -4], s: 0.9, r: [0.1, 0.15] },
  { type: 'oct', p: [4.8, 2.6, -5], s: 0.7, r: [0.14, 0.1] },
  { type: 'torus', p: [-3.6, -1.2, -3], s: 0.6, r: [0.2, 0.08] },
  { type: 'ico', p: [6, -0.8, -3], s: 0.45, r: [0.12, 0.2] },
  { type: 'knot', p: [1, 3.4, -7], s: 0.8, r: [0.08, 0.12] },
  { type: 'oct', p: [-6.5, 0.2, -6], s: 1.1, r: [0.05, 0.09] },
]

function Shape({ cfg, accent }) {
  const ref = useRef(null)
  useFrame(({ clock }, dt) => {
    const m = ref.current
    if (!m) return
    const d = Math.min(dt, 0.05)
    m.rotation.x += d * cfg.r[0]
    m.rotation.y += d * cfg.r[1]
    m.position.y = cfg.p[1] + Math.sin(clock.elapsedTime * 0.4 + cfg.p[0]) * 0.25
  })

  return (
    <mesh ref={ref} position={cfg.p} scale={cfg.s}>
      {cfg.type === 'ico' && <icosahedronGeometry args={[1, 1]} />}
      {cfg.type === 'oct' && <octahedronGeometry args={[1, 0]} />}
      {cfg.type === 'torus' && <torusGeometry args={[1, 0.28, 12, 48]} />}
      {cfg.type === 'knot' && <torusKnotGeometry args={[0.8, 0.22, 90, 10]} />}
      <meshBasicMaterial color={accent} wireframe transparent opacity={0.28} toneMapped={false} />
    </mesh>
  )
}

export function FloatingShapes({ accent }) {
  return (
    <group>
      {SHAPES.map((cfg, i) => (
        <Shape key={i} cfg={cfg} accent={accent} />
      ))}
    </group>
  )
}
