import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { hexA } from '../../utils/color'
import { cn } from '../../utils/cn'

/**
 * Lightweight CSS-3D laptop used for product visuals (cards, rows, modal).
 * Dozens of WebGL canvases would tank performance, so the heavy Three.js
 * laptop is reserved for hero / flagship / about, and this one is used everywhere else.
 *
 *  - open: 0..1, how far the lid is raised (animates smoothly)
 *  - tilt: follow the mouse with a spring (3D parallax)
 */
export default function CssLaptop({ accent = '#27d8ff', open = 0.6, tilt = false, className = '' }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 120, damping: 16 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), { stiffness: 120, damping: 16 })

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const lidDeg = (1 - open) * 55

  return (
    <div
      ref={ref}
      onMouseMove={tilt ? onMove : undefined}
      onMouseLeave={tilt ? onLeave : undefined}
      className={cn('relative aspect-[16/11] w-full select-none', className)}
      style={{ perspective: '1400px' }}
    >
      {/* ground glow */}
      <div
        className="pointer-events-none absolute bottom-[1%] left-1/2 h-[14%] w-[72%] -translate-x-1/2 rounded-full blur-2xl"
        style={{ background: hexA(accent, 0.45) }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-end"
        style={{ rotateX: tilt ? rotX : 0, rotateY: tilt ? rotY : 0, transformStyle: 'preserve-3d' }}
      >
        {/* lid */}
        <motion.div
          className="relative aspect-[16/10] w-[78%] overflow-hidden rounded-t-[10px] border-[5px] border-b-0 border-[#0d1017]"
          style={{
            transformOrigin: '50% 100%',
            boxShadow: `0 0 0 1px rgba(255,255,255,0.12), 0 -10px 60px -20px ${hexA(accent, 0.55)}`,
            background: `radial-gradient(120% 90% at 18% 100%, ${hexA(accent, 0.9)} 0%, transparent 60%), radial-gradient(90% 80% at 88% 8%, rgba(91,91,255,0.6), transparent 55%), #04070d`,
          }}
          animate={{ rotateX: lidDeg }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[clamp(0.55rem,1.6vw,1rem)] font-bold tracking-[0.5em] text-white/90">NEXOGIL</span>
          </div>
          {/* glass sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />
        </motion.div>

        {/* base */}
        <div
          className="relative h-[3.6%] w-[96%]"
          style={{
            clipPath: 'polygon(3% 0, 97% 0, 100% 100%, 0 100%)',
            background: 'linear-gradient(180deg, #d5dae3 0%, #7b8291 55%, #2a2f3a 100%)',
          }}
        >
          <div className="mx-auto h-[45%] w-[16%] rounded-b-md bg-black/35" />
        </div>
      </motion.div>
    </div>
  )
}
