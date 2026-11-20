import { Suspense, lazy, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Mouse } from 'lucide-react'
import Button from './ui/Button'
import LaptopFallback from './ui/LaptopFallback'
import { ACCENT } from '../config/theme'
import { EASE } from '../utils/motion'
import { scrollToId } from '../utils/scroll'

const HeroCanvas = lazy(() => import('../three/HeroCanvas'))

function Line({ text, delay, className = '' }) {
  return (
    <span className={`block overflow-hidden pb-[0.07em] ${className}`} aria-hidden="true">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '112%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.1, delay: delay + i * 0.045, ease: EASE }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const canvasY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90])

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[660px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_75%_45%,rgba(39,216,255,0.14),transparent_70%),radial-gradient(50%_50%_at_8%_95%,rgba(91,91,255,0.14),transparent_70%)]" />

      <motion.div style={{ y: canvasY, opacity: canvasOpacity }} className="absolute inset-0">
        <Suspense fallback={<LaptopFallback accent={ACCENT} />}>
          <HeroCanvas accent={ACCENT} className="absolute inset-0" />
        </Suspense>
      </motion.div>

      {/* pointer-events-none so the laptop underneath can be dragged */}
      <motion.div
        style={{ y: textY }}
        className="pointer-events-none relative z-10 flex h-full flex-col justify-start px-6 pt-28 lg:justify-center lg:px-[6vw] lg:pt-16"
      >
        <motion.p
          className="eyebrow mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
        >
          Futuristic Digital Showroom
        </motion.p>

        <h1
          aria-label="POWER BEYOND LIMITS."
          className="font-display text-[clamp(3.1rem,10.5vw,9.5rem)] font-bold leading-[0.88] tracking-[-0.045em] text-white"
        >
          <Line text="POWER" delay={0.3} />
          <Line text="BEYOND" delay={0.5} className="lg:pl-[7vw]" />
          <Line text="LIMITS." delay={0.7} className="text-gradient" />
        </h1>

        <motion.p
          className="mt-7 max-w-md text-base leading-relaxed text-silver/75 lg:ml-[7vw] lg:text-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3, ease: EASE }}
        >
          Find the machine that moves your world.
        </motion.p>

        <motion.div
          className="pointer-events-auto mt-9 flex flex-wrap gap-3 lg:ml-[7vw]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: EASE }}
        >
          <Button arrow onClick={() => scrollToId('collection')}>
            Explore Collection
          </Button>
          <Button variant="ghost" onClick={() => scrollToId('flagship')}>
            Discover Your Power
          </Button>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-6 bottom-7 z-10 flex items-end justify-between lg:inset-x-[6vw]">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-silver/50">
          <span className="relative block h-10 w-px overflow-hidden bg-white/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-neon"
              animate={{ y: ['-100%', '260%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          Scroll
        </div>
        <div className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-silver/50 sm:flex">
          <Mouse className="size-4" /> Drag to rotate
        </div>
      </div>
    </section>
  )
}
