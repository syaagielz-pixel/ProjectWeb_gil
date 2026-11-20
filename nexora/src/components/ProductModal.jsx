import { motion } from 'framer-motion'
import { Check, MessageCircle, ShoppingBag, X } from 'lucide-react'
import CssLaptop from './ui/CssLaptop'
import Button from './ui/Button'
import { SPEC_FIELDS } from '../data/specFields'
import { useCart } from '../context/CartContext'
import { useModalBehavior } from '../hooks/useModalBehavior'
import { whatsappLink } from '../config/site'
import { formatPrice } from '../utils/format'
import { hexA } from '../utils/color'

export default function ProductModal({ product, onClose }) {
  const { add, openCart } = useCart()
  useModalBehavior(true, onClose)

  return (
    <motion.div
      className="fixed inset-0 z-[85] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 80, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        className="relative grid max-h-[94svh] w-full max-w-5xl overflow-y-auto rounded-t-[2rem] border border-white/10 bg-carbon sm:rounded-[2rem] lg:grid-cols-2"
      >
        <button type="button" onClick={onClose} aria-label="Close details" className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
          <X className="size-5" />
        </button>

        <div
          className="relative grid min-h-[300px] place-items-center overflow-hidden p-8"
          style={{ background: `radial-gradient(90% 80% at 50% 30%, ${hexA(product.accent, 0.35)}, transparent 70%), #080a0f` }}
        >
          <CssLaptop accent={product.accent} open={1} tilt className="w-full max-w-[460px]" />
        </div>

        <div className="p-6 sm:p-9">
          <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-neon">{product.badge}</span>
          <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-silver/45">{product.brand}</p>
          <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{product.name}</h3>
          <p className="mt-4 text-sm leading-relaxed text-silver/70">{product.blurb}</p>

          <dl className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {SPEC_FIELDS.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between gap-4 py-3 text-sm">
                <dt className="flex items-center gap-2 text-silver/50">
                  <Icon className="size-4" /> {label}
                </dt>
                <dd className="text-right text-white">{product[key]}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-5 space-y-2 text-sm text-silver/75">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2.5">
                <Check className="size-4 text-neon" /> {h}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="font-display text-3xl font-semibold">{formatPrice(product.price)}</p>
            <div className="flex flex-wrap gap-2">
              <a
                href={whatsappLink(`Halo NEXOGIL, saya ingin bertanya tentang ${product.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] transition hover:border-neon/60"
              >
                <MessageCircle className="size-4" /> Ask
              </a>
              <Button
                onClick={() => {
                  add(product)
                  onClose()
                  openCart()
                }}
              >
                <ShoppingBag className="size-4" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
