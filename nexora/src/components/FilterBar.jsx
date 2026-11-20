import { useState } from 'react'
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react'
import { BRANDS, CATEGORIES, GPU_TYPES, PRICE_MAX, PRICE_MIN, SORTS } from '../data/products'
import { formatMillions } from '../utils/format'
import { cn } from '../utils/cn'

function Chip({ on, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300',
        on ? 'border-neon bg-neon/15 text-neon' : 'border-white/10 text-silver/70 hover:border-white/30 hover:text-white',
      )}
    >
      {children}
    </button>
  )
}

function Group({ label, children }) {
  return (
    <div>
      <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-silver/40">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export default function FilterBar({ shop }) {
  const { filters, update, toggle, reset, activeCount, results } = shop
  const [open, setOpen] = useState(false)
  const fill = ((filters.maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  return (
    <div className="glass rounded-[1.75rem] p-4 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search laptops by name</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-silver/50" />
          <input
            id="product-search"
            type="search"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Search laptops — e.g. Zephyrus, MacBook…"
            className="h-12 w-full rounded-full border border-white/10 bg-black/30 pl-11 pr-11 text-sm text-white outline-none placeholder:text-silver/35 focus:border-neon/60"
          />
          {filters.query && (
            <button type="button" aria-label="Clear search" onClick={() => update({ query: '' })} className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-silver/60 hover:bg-white/10 hover:text-white">
              <X className="size-4" />
            </button>
          )}
        </label>

        <div className="flex gap-3">
          <label className="flex-1 sm:flex-none">
            <span className="sr-only">Sort</span>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="h-12 w-full rounded-full border border-white/10 bg-black/30 px-5 text-sm text-white outline-none focus:border-neon/60 sm:w-56 [&>option]:bg-carbon"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-black/30 px-5 text-sm text-white transition hover:border-white/30 lg:hidden"
          >
            <SlidersHorizontal className="size-4" /> Filters{activeCount > 0 && <span className="rounded-full bg-neon px-1.5 text-[10px] font-bold text-ink">{activeCount}</span>}
          </button>
        </div>
      </div>

      <div className={cn('mt-6 grid-cols-1 gap-6 lg:grid lg:grid-cols-4 lg:gap-8', open ? 'grid' : 'hidden')}>
        <Group label="Category">
          <Chip on={filters.category === 'All'} onClick={() => update({ category: 'All' })}>
            All
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} on={filters.category === c.id} onClick={() => update({ category: c.id })}>
              {c.id}
            </Chip>
          ))}
        </Group>

        <Group label="Brand">
          {BRANDS.map((b) => (
            <Chip key={b} on={filters.brands.includes(b)} onClick={() => toggle('brands', b)}>
              {b}
            </Chip>
          ))}
        </Group>

        <Group label="Graphics">
          {GPU_TYPES.map((g) => (
            <Chip key={g} on={filters.gpuTypes.includes(g)} onClick={() => toggle('gpuTypes', g)}>
              {g}
            </Chip>
          ))}
        </Group>

        <div>
          <p className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-silver/40">
            <span>Max price</span>
            <span className="text-neon">{formatMillions(filters.maxPrice)}</span>
          </p>
          <input
            type="range"
            className="nx-range"
            aria-label="Maximum price"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={1_000_000}
            value={filters.maxPrice}
            style={{ '--fill': `${fill}%` }}
            onChange={(e) => update({ maxPrice: Number(e.target.value) })}
          />
          <div className="mt-2 flex justify-between text-[10px] text-silver/35">
            <span>{formatMillions(PRICE_MIN)}</span>
            <span>{formatMillions(PRICE_MAX)}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4 text-xs text-silver/50">
        <span aria-live="polite">
          {results.length} {results.length === 1 ? 'machine' : 'machines'} found
        </span>
        {activeCount > 0 && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-neon transition hover:text-white">
            <RotateCcw className="size-3.5" /> Reset filters
          </button>
        )}
      </div>
    </div>
  )
}
