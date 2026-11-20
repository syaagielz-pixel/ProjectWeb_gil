import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, SearchX } from 'lucide-react'
import FilterBar from './FilterBar'
import ProductCard, { VARIANT_ORDER } from './ProductCard'
import Reveal from './ui/Reveal'
import Button from './ui/Button'
import { PRODUCTS } from '../data/products'

export default function ProductShowcase({ shop, onDetails }) {
  const { results, reset } = shop
  const rail = useRef(null)
  const bar = useRef(null)

  const syncBar = () => {
    const el = rail.current
    if (!el || !bar.current) return
    const max = el.scrollWidth - el.clientWidth
    const ratio = el.clientWidth / el.scrollWidth
    const pos = max > 0 ? el.scrollLeft / max : 0
    bar.current.style.width = `${Math.max(ratio, 0.12) * 100}%`
    bar.current.style.transform = `translateX(${pos * (1 / Math.max(ratio, 0.12) - 1) * 100}%)`
  }

  const key = results.map((p) => p.id).join('|')
  useEffect(() => {
    rail.current?.scrollTo({ left: 0 })
    syncBar()
  }, [key])

  const scrollBy = (dir) =>
    rail.current?.scrollBy({ left: dir * Math.min(660, rail.current.clientWidth * 0.8), behavior: 'smooth' })

  return (
    <section id="collection" className="relative scroll-mt-16 py-28 lg:py-40">
      <div className="px-6 lg:px-[6vw]">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow mb-5">02 — Collection</p>
            <h2 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.04em]">
              The <span className="text-gradient">lineup.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-silver/60">
            {PRODUCTS.length} hand-picked machines. Scroll sideways, filter by what matters, and hover any model to wake it up.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <FilterBar shop={shop} />
        </Reveal>
      </div>

      {results.length === 0 ? (
        <div className="mx-6 mt-12 flex flex-col items-center gap-5 rounded-[2rem] border border-dashed border-white/15 px-6 py-24 text-center lg:mx-[6vw]">
          <SearchX className="size-10 text-silver/40" />
          <p className="font-display text-2xl text-white">No machine matches these filters.</p>
          <p className="text-sm text-silver/50">Try a different keyword or widen the price range.</p>
          <Button variant="ghost" onClick={reset}>
            Reset filters
          </Button>
        </div>
      ) : (
        <>
          <div
            ref={rail}
            onScroll={syncBar}
            className="no-scrollbar mt-12 flex snap-x snap-mandatory items-start gap-5 overflow-x-auto px-6 pb-12 pt-4 lg:gap-8 lg:px-[6vw]"
          >
            <AnimatePresence initial={false}>
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} variant={VARIANT_ORDER[i % VARIANT_ORDER.length]} onDetails={onDetails} />
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6 px-6 lg:px-[6vw]">
            <div className="relative h-px flex-1 overflow-hidden bg-white/10">
              <div ref={bar} className="absolute left-0 top-0 h-full w-1/3 bg-neon" />
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} className="grid size-12 place-items-center rounded-full border border-white/15 transition hover:border-neon hover:text-neon">
                <ArrowLeft className="size-5" />
              </button>
              <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} className="grid size-12 place-items-center rounded-full border border-white/15 transition hover:border-neon hover:text-neon">
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
