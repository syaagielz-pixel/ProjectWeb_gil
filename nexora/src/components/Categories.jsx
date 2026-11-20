import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES, PRODUCTS } from '../data/products'
import Reveal from './ui/Reveal'
import { cn } from '../utils/cn'

function Panel({ cat, index, active, onActivate, onSelect }) {
  const isActive = active === index
  const count = PRODUCTS.filter((p) => p.categories.includes(cat.id)).length
  const models = PRODUCTS.filter((p) => p.categories.includes(cat.id)).slice(0, 3)

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${cat.id} laptops`}
      aria-expanded={isActive}
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      onClick={() => (isActive ? onSelect(cat.id) : onActivate(index))}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(cat.id)}
      animate={{ flexGrow: isActive ? 4 : 1 }}
      transition={{ type: 'spring', stiffness: 130, damping: 22 }}
      style={{ flexBasis: 0, '--hue': cat.hue }}
      className={cn('group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/10', cat.cls)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* collapsed label */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-between px-6 transition-opacity duration-500 lg:flex-col lg:justify-end lg:px-0 lg:py-8',
          isActive ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <span className="font-display text-xs tracking-[0.3em] text-white/50 lg:mb-6">0{index + 1}</span>
        <span className="font-display text-2xl font-semibold uppercase tracking-tight text-white/90 lg:rotate-180 lg:text-3xl lg:[writing-mode:vertical-rl]">
          {cat.id}
        </span>
      </div>

      {/* expanded content */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-500 lg:p-9',
          isActive ? 'opacity-100 delay-150' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex items-start justify-between">
          <span className="font-display text-xs tracking-[0.3em] text-white/60">0{index + 1} / 0{CATEGORIES.length}</span>
          <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
            {count} models
          </span>
        </div>

        <div>
          <h3 className="font-display text-[clamp(2.4rem,5.2vw,5.8rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-white transition-all duration-700 group-hover:tracking-[-0.02em]">
            {cat.id}
          </h3>
          <p className="mt-3 text-sm text-white/70 lg:text-base">{cat.tagline}</p>
          <ul className="mt-4 hidden flex-wrap gap-2 text-[11px] text-white/60 sm:flex">
            {models.map((m) => (
              <li key={m.id} className="rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                {m.name}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(cat.id)
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition hover:bg-neon"
          >
            Browse {cat.id} <ArrowUpRight className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Categories({ onSelect }) {
  const [active, setActive] = useState(0)

  return (
    <section id="categories" className="relative scroll-mt-16 px-6 py-28 lg:px-[6vw] lg:py-40">
      <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow mb-5">01 — Categories</p>
          <h2 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.04em]">
            Choose your <span className="text-stroke">kind of power.</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-silver/60">
          Five worlds, one standard. Hover a panel to explore, then tap it again to browse the machines inside.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-14 flex h-[760px] flex-col gap-3 lg:h-[620px] lg:flex-row">
        {CATEGORIES.map((cat, i) => (
          <Panel key={cat.id} cat={cat} index={i} active={active} onActivate={setActive} onSelect={onSelect} />
        ))}
      </Reveal>
    </section>
  )
}
