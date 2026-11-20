import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { clamp, prefersReducedMotion } from '../utils/motion'

/**
 * Turntable + drag-to-rotate + mouse parallax in one wrapper.
 *
 *  - autoSpeed:  slow idle rotation in rad/s (0 disables)
 *  - parallax:   how far the object leans toward the pointer
 *  - rotationY:  extra yaw, number or MotionValue (used for scroll-driven rotation)
 *  - drag:       allow pointer drag. Canvas uses touch-action: pan-y so
 *                vertical swipes still scroll the page on mobile.
 */
export default function RotatableGroup({
  children,
  autoSpeed = 0.25,
  parallax = 0.3,
  rotationY = 0,
  drag = true,
  ...props
}) {
  const group = useRef(null)
  const gl = useThree((s) => s.gl)
  const s = useRef({
    auto: -0.45,
    dragX: 0,
    dragY: 0,
    vel: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    px: 0,
    py: 0,
    tpx: 0,
    tpy: 0,
  })

  useEffect(() => {
    const el = gl.domElement
    const st = s.current
    el.style.touchAction = 'pan-y'
    el.style.cursor = drag ? 'grab' : ''

    const down = (e) => {
      if (!drag) return
      st.dragging = true
      st.lastX = e.clientX
      st.lastY = e.clientY
      el.style.cursor = 'grabbing'
    }
    const move = (e) => {
      st.tpx = (e.clientX / window.innerWidth) * 2 - 1
      st.tpy = (e.clientY / window.innerHeight) * 2 - 1
      if (!st.dragging) return
      const dx = e.clientX - st.lastX
      const dy = e.clientY - st.lastY
      st.lastX = e.clientX
      st.lastY = e.clientY
      st.dragY += dx * 0.008
      st.vel = dx * 0.008
      st.dragX = clamp(st.dragX + dy * 0.004, -0.5, 0.5)
    }
    const up = () => {
      st.dragging = false
      el.style.cursor = drag ? 'grab' : ''
    }

    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [gl, drag])

  useFrame((_, rawDt) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(rawDt, 0.05)
    const st = s.current
    const calm = prefersReducedMotion()

    if (st.dragging) {
      st.vel *= 0.8
    } else {
      if (!calm) st.auto += dt * autoSpeed
      st.dragY += st.vel
      st.vel *= 0.92
      st.dragX = THREE.MathUtils.damp(st.dragX, 0, 2, dt)
    }
    st.px = THREE.MathUtils.damp(st.px, calm ? 0 : st.tpx, 3, dt)
    st.py = THREE.MathUtils.damp(st.py, calm ? 0 : st.tpy, 3, dt)

    const extra = typeof rotationY === 'number' ? rotationY : rotationY.get()
    g.rotation.y = st.auto + st.dragY + extra + st.px * parallax
    g.rotation.x = st.dragX + st.py * parallax * 0.5
  })

  return (
    <group ref={group} {...props}>
      {children}
    </group>
  )
}
