import { Suspense, lazy, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import AboutCanvasFallback from './ui/AboutFallback'
import Reveal from './ui/Reveal'
import { ACCENT } from '../config/theme'

const AboutCanvas = lazy(() => import('../three/AboutCanvas'))

const HEADLINE = "Technology is not just a tool. It's an extension of your ambition.".split(' ')

const CHAPTERS = [
  { n: '01', title: 'Curated, not crowded', text: 'We stock fewer machines on purpose. Every laptop earns its place by being the best at what it was built for.' },
  { n: '02', title: 'Tested before it ships', text: 'Each unit is checked out of the box — display, thermals, keyboard and battery — so what arrives is what you expected.' },
  { n: '03', title: 'Support that stays', text: 'Warranty help, upgrades and advice do not end at checkout. Talk to people who actually know the hardware.' },
]

function Word({ progress, range, children, strong }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <motion.span style={{ opacity }} className={`mr-[0.26em] inline-block ${strong ? 'text-gradient' : ''}`}>
      {children}
    </motion.span>
  )
}

export default function About() {
  const headRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: headRef, offset: ['start 0.85', 'end 0.45'] })

  return (
    <section id="about" className="relative scroll-mt-16 overflow-hidden py-28 lg:py-44">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-70 lg:w-[62%]">
        <Suspense fallback={<AboutCanvasFallback />}>
          <AboutCanvas accent={ACCENT} className="absolute inset-0" />
        </Suspense>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#05060a_0%,rgba(5,6,10,0.7)_45%,transparent_100%)]" />

      <div className="relative z-10 px-6 lg:px-[6vw]">
        <Reveal>
          <p className="eyebrow mb-8">04 — About NEXOGIL</p>
        </Reveal>

        <h2
          ref={headRef}
          className="max-w-5xl font-display text-[clamp(2.2rem,6.6vw,6.2rem)] font-bold leading-[1.02] tracking-[-0.04em]"
          aria-label={HEADLINE.join(' ')}
        >
          {HEADLINE.map((w, i) => {
            const start = (i / HEADLINE.length) * 0.8
            return (
              <Word key={i} progress={scrollYProgress} range={[start, start + 0.2]} strong={w.startsWith('ambition')}>
                {w}
              </Word>
            )
          })}
        </h2>

        <div className="mt-24 grid gap-10 lg:mt-36 lg:grid-cols-3 lg:gap-12">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.12} className="border-t border-white/15 pt-6">
              <span className="font-display text-sm tracking-[0.3em] text-neon">{c.n}</span>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight lg:text-3xl">{c.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-silver/60">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-28 overflow-hidden lg:mt-40" aria-hidden="true">
        <div className="flex w-max animate-marquee whitespace-nowrap font-display text-[clamp(3.5rem,11vw,10rem)] font-bold uppercase leading-none tracking-[-0.04em]">
          {[0, 1].map((k) => (
            <span key={k} className="text-stroke pr-10">
              Performance — Precision — Portability —
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
