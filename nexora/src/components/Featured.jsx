import { Suspense, lazy, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import Button from './ui/Button'
import LaptopFallback from './ui/LaptopFallback'
import { PRODUCTS } from '../data/products'
import { SPEC_FIELDS } from '../data/specFields'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

const FeaturedCanvas = lazy(() => import('../three/FeaturedCanvas'))
const FLAGSHIP = PRODUCTS.find((p) => p.flagship) ?? PRODUCTS[0]

function SpecReveal({ progress, start, icon: Icon, label, value }) {
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1])
  const y = useTransform(progress, [start, start + 0.1], [36, 0])
  return (
    <motion.div style={{ opacity, y }} className="border-t border-white/20 pt-3 lg:pt-4">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.24em] text-silver/50">
        <Icon className="size-3" /> {label}
      </p>
      <p className="mt-1.5 font-display text-[15px] font-medium leading-snug text-white lg:text-2xl">{value}</p>
    </motion.div>
  )
}

export default function Featured({ onDetails }) {
  const ref = useRef(null)
  const { add, openCart } = useCart()
  const { scrollYProgress: progress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const lid = useTransform(progress, [0.04, 0.4], [0, 1])
  const yaw = useTransform(progress, [0, 1], [-0.7, 0.5])
  const ctaOpacity = useTransform(progress, [0.76, 0.9], [0, 1])
  const ctaEvents = useTransform(progress, (v) => (v > 0.8 ? 'auto' : 'none'))
  const bar = useTransform(progress, [0, 1], ['0%', '100%'])

  return (
    <section id="flagship" ref={ref} className="relative h-[320vh] scroll-mt-0">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_70%_55%,rgba(39,216,255,0.16),transparent_70%),radial-gradient(60%_60%_at_0%_0%,rgba(91,91,255,0.16),transparent_70%),linear-gradient(180deg,#05060a,#080b12_60%,#05060a)]" />

        <Suspense fallback={<LaptopFallback accent={FLAGSHIP.accent} />}>
          <FeaturedCanvas accent={FLAGSHIP.accent} lid={lid} yaw={yaw} progress={progress} className="absolute inset-0" />
        </Suspense>

        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-6 pb-8 pt-24 lg:px-[6vw] lg:pb-12 lg:pt-28">
          <div>
            <p className="eyebrow mb-4">03 — Flagship</p>
            <h2 className="max-w-3xl font-display text-[clamp(1.9rem,6.2vw,5.6rem)] font-bold uppercase leading-[0.95] tracking-[-0.035em]">
              Engineered for the <span className="text-gradient">next generation.</span>
            </h2>
            <p className="mt-4 text-sm text-silver/60 lg:text-base">
              {FLAGSHIP.name} <span className="mx-2 text-white/20">/</span> {FLAGSHIP.badge}
            </p>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 lg:grid-cols-5 lg:gap-x-8">
              {SPEC_FIELDS.map(({ key, label, icon }, i) => (
                <SpecReveal key={key} progress={progress} start={0.26 + i * 0.09} icon={icon} label={label} value={FLAGSHIP[key]} />
              ))}
            </div>

            <motion.div
              style={{ opacity: ctaOpacity, pointerEvents: ctaEvents }}
              className="mt-6 flex flex-wrap items-center justify-between gap-4 lg:mt-8"
            >
              <p className="font-display text-2xl font-semibold lg:text-4xl">{formatPrice(FLAGSHIP.price)}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onDetails(FLAGSHIP)}>
                  View Details
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    add(FLAGSHIP)
                    openCart()
                  }}
                >
                  <ShoppingBag className="size-4" /> Add to Cart
                </Button>
              </div>
            </motion.div>

            <div className="mt-6 h-px w-full bg-white/10">
              <motion.div style={{ width: bar }} className="h-full bg-neon" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
