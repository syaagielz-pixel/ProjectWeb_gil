import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import Scene3D from './Scene3D'
import RotatableGroup from './RotatableGroup'
import { StudioEnvironment, StudioLights } from './StageEffects'

/** Small satellites orbiting the sculpture. */
function Orbiters({ accent }) {
  const group = useRef(null)
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += Math.min(dt, 0.05) * 0.5
  })
  return (
    <group ref={group} rotation={[0.5, 0, 0.3]}>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 2.3, 0, Math.sin(a) * 2.3]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
        )
      })}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.29, 2.3, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.25} toneMapped={false} />
      </mesh>
    </group>
  )
}

function AboutScene({ accent }) {
  return (
    <>
      <StudioEnvironment accent={accent} />
      <StudioLights accent={accent} />
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
        <RotatableGroup autoSpeed={0.15} parallax={0.4}>
          {/* polished knot */}
          <mesh>
            <torusKnotGeometry args={[1.1, 0.3, 160, 18]} />
            <meshStandardMaterial color="#0d1118" metalness={1} roughness={0.16} />
          </mesh>
          {/* wire shell */}
          <mesh scale={1.06}>
            <torusKnotGeometry args={[1.1, 0.3, 120, 12]} />
            <meshBasicMaterial color={accent} wireframe transparent opacity={0.22} toneMapped={false} />
          </mesh>
          {/* glowing core */}
          <mesh>
            <icosahedronGeometry args={[0.45, 1]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
          <Orbiters accent={accent} />
        </RotatableGroup>
      </Float>
      <Sparkles count={60} scale={[7, 7, 7]} size={2} speed={0.3} opacity={0.7} color={accent} />
    </>
  )
}

export default function AboutCanvas({ accent = '#27d8ff', className }) {
  return (
    <Scene3D className={className} camera={{ position: [0, 0, 6.2], fov: 40 }} fallback={null}>
      <AboutScene accent={accent} />
    </Scene3D>
  )
}
