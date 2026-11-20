import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ShoppingBag } from 'lucide-react'
import CssLaptop from './ui/CssLaptop'
import Button from './ui/Button'
import { SPEC_FIELDS } from '../data/specFields'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
import { cn } from '../utils/cn'
import { EASE } from '../utils/motion'

const VARIANTS = {
  lg: { w: 'w-[86vw] sm:w-[540px] lg:w-[640px]', offset: '', name: 'text-3xl lg:text-5xl', pad: 'p-6 lg:p-9', visual: 'max-w-[430px]' },
  md: { w: 'w-[80vw] sm:w-[440px] lg:w-[480px]', offset: 'lg:mt-24', name: 'text-2xl lg:text-4xl', pad: 'p-6 lg:p-8', visual: 'max-w-[340px]' },
  sm: { w: 'w-[76vw] sm:w-[380px]', offset: 'lg:mt-10', name: 'text-2xl lg:text-3xl', pad: 'p-6 lg:p-7', visual: 'max-w-[290px]' },
}
export const VARIANT_ORDER = ['lg', 'sm', 'md', 'md', 'lg', 'sm']

const WIDE = new Set(['cpu', 'gpu', 'display'])

export default function ProductCard({ product, index, variant, onDetails }) {
  const { add } = useCart()
  const ref = useRef(null)
  const [hover, setHover] = useState(false)
  const [added, setAdded] = useState(false)
  const v = VARIANTS[variant]

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  const handleAdd = () => {
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <motion.article
      ref={ref}
      layout="position"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.8, ease: EASE }}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ '--accent': product.accent }}
      className={cn(
        'group relative flex shrink-0 snap-center flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-graphite transition-colors duration-700 hover:border-white/25',
        v.w,
        v.offset,
        v.pad,
      )}
    >
      <div className="pc-bg" />
      <div className="pc-spot" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-neon backdrop-blur">
          {product.badge}
        </span>
        <span className="font-display text-xs tracking-[0.3em] text-silver/40">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <div className="relative z-10 my-5 flex justify-center transition-transform duration-700 ease-out group-hover:scale-110">
        <CssLaptop accent={product.accent} open={hover ? 1 : 0.55} tilt className={cn('w-full', v.visual)} />
      </div>

      <div className="relative z-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-silver/45">{product.brand}</p>
        <h3 className={cn('mt-1 font-display font-semibold leading-tight tracking-tight text-white', v.name)}>{product.name}</h3>

        <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-white/10 pt-5">
          {SPEC_FIELDS.map(({ key, label, icon: Icon }) => (
            <div key={key} className={cn('min-w-0', WIDE.has(key) && 'col-span-2')}>
              <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-silver/40">
                <Icon className="size-3" /> {label}
              </dt>
              <dd className="mt-0.5 truncate text-[13px] text-silver">{product[key]}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-display text-xl font-semibold text-white lg:text-2xl">{formatPrice(product.price)}</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onDetails(product)}>
              View Details
            </Button>
            <Button size="sm" onClick={handleAdd} aria-label={`Add ${product.name} to cart`}>
              {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
              {added ? 'Added' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
