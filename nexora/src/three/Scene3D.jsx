import { Component, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

let webglSupport
export function canRenderWebGL() {
  if (webglSupport !== undefined) return webglSupport
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    webglSupport = Boolean(window.WebGLRenderingContext && gl)
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglSupport = false
  }
  return webglSupport
}

class SceneBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.warn('[NEXOGIL] 3D scene failed, using CSS fallback.', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * Shared <Canvas> wrapper:
 *  - pauses rendering while scrolled off-screen (big win for battery / lag)
 *  - falls back to `fallback` when WebGL is missing or the scene throws
 *  - caps pixel ratio
 */
export default function Scene3D({ children, camera, className = '', fallback = null, ...rest }) {
  const hostRef = useRef(null)
  const [visible, setVisible] = useState(true)
  const supported = useMemo(() => canRenderWebGL(), [])

  useEffect(() => {
    const el = hostRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '160px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={hostRef} className={className}>
      {supported ? (
        <SceneBoundary fallback={fallback}>
          <Canvas
            frameloop={visible ? 'always' : 'never'}
            dpr={[1, 1.75]}
            camera={camera}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0)
              gl.toneMappingExposure = 1.1
            }}
            {...rest}
          >
            {children}
          </Canvas>
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  )
}
