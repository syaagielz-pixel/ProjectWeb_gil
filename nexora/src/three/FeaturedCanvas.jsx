import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import Scene3D from './Scene3D'
import LaptopModel from './LaptopModel'
import RotatableGroup from './RotatableGroup'
import { FloorStage, ResponsiveStage, StudioEnvironment, StudioLights } from './StageEffects'
import LaptopFallback from '../components/ui/LaptopFallback'

/** Camera glides according to scroll progress (a MotionValue from the parent section). */
function ScrollRig({ progress }) {
  useFrame(({ camera }, dt) => {
    const p = progress.get()
    const d = Math.min(dt, 0.05)
    const tx = THREE.MathUtils.lerp(-2.4, 1.2, p)
    const ty = THREE.MathUtils.lerp(3.0, 1.1, p)
    const tz = THREE.MathUtils.lerp(9.6, 6.4, p)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 3, d)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 3, d)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, tz, 3, d)
    camera.lookAt(0, -0.1, 0)
  })
  return null
}

function FlagshipScene({ accent, lid, yaw, progress }) {
  return (
    <>
      <fog attach="fog" args={['#05060a', 9, 26]} />
      <ScrollRig progress={progress} />
      <StudioEnvironment accent={accent} />
      <StudioLights accent={accent} />

      <ResponsiveStage wideShift={0.16}>
        <FloorStage accent={accent} />
        <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.35} floatingRange={[0, 0.2]}>
          <RotatableGroup autoSpeed={0} parallax={0.2} rotationY={yaw}>
            <LaptopModel accent={accent} lid={lid} position={[0, -0.85, 0.25]} />
          </RotatableGroup>
        </Float>
      </ResponsiveStage>

      <Sparkles count={50} scale={[12, 6, 8]} size={2} speed={0.25} opacity={0.6} color={accent} />
    </>
  )
}

export default function FeaturedCanvas({ accent, lid, yaw, progress, className }) {
  return (
    <Scene3D
      className={className}
      camera={{ position: [-2.4, 3.0, 9.6], fov: 38, near: 0.1, far: 60 }}
      fallback={<LaptopFallback accent={accent} />}
    >
      <FlagshipScene accent={accent} lid={lid} yaw={yaw} progress={progress} />
    </Scene3D>
  )
}
