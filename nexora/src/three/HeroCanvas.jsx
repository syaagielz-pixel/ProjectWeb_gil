import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import Scene3D from './Scene3D'
import LaptopModel from './LaptopModel'
import RotatableGroup from './RotatableGroup'
import {
  FloatingShapes,
  FloorStage,
  ResponsiveStage,
  StudioEnvironment,
  StudioLights,
} from './StageEffects'
import LaptopFallback from '../components/ui/LaptopFallback'

const FROM = [0, 3.4, 12.5]
const TO = [0, 1.5, 6.4]

/** Cinematic intro: the camera dollies in and settles on the laptop. */
function CameraRig() {
  const t = useRef(0)
  useFrame(({ camera }, dt) => {
    t.current = Math.min(1, t.current + Math.min(dt, 0.05) / 3.4)
    const e = 1 - (1 - t.current) ** 3
    camera.position.set(
      THREE.MathUtils.lerp(FROM[0], TO[0], e),
      THREE.MathUtils.lerp(FROM[1], TO[1], e),
      THREE.MathUtils.lerp(FROM[2], TO[2], e),
    )
    camera.lookAt(0, 0, 0)
  })
  return null
}

function HeroScene({ accent }) {
  return (
    <>
      <fog attach="fog" args={['#05060a', 9, 24]} />
      <CameraRig />
      <StudioEnvironment accent={accent} />
      <StudioLights accent={accent} />

      <ResponsiveStage>
        <FloorStage accent={accent} />
        <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[0, 0.25]}>
          <RotatableGroup autoSpeed={0.22} parallax={0.35}>
            <LaptopModel accent={accent} lid={1} position={[0, -0.85, 0.25]} />
          </RotatableGroup>
        </Float>
        <FloatingShapes accent={accent} />
      </ResponsiveStage>

      <Sparkles count={70} scale={[14, 7, 9]} size={2.2} speed={0.3} opacity={0.7} color={accent} />
    </>
  )
}

export default function HeroCanvas({ accent, className }) {
  return (
    <Scene3D
      className={className}
      camera={{ position: FROM, fov: 38, near: 0.1, far: 60 }}
      fallback={<LaptopFallback accent={accent} />}
    >
      <HeroScene accent={accent} />
    </Scene3D>
  )
}
