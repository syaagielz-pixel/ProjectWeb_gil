import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import CssLaptop from './ui/CssLaptop'
import Button from './ui/Button'
import { useCart } from '../context/CartContext'
import { useModalBehavior } from '../hooks/useModalBehavior'
import { whatsappLink } from '../config/site'
import { formatPrice } from '../utils/format'
import { scrollToId } from '../utils/scroll'

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, remove, clear, total, count } = useCart()
  useModalBehavior(isOpen, closeCart)

  const checkout = () => {
    const lines = items.map((i) => `• ${i.product.name} × ${i.qty} — ${formatPrice(i.product.price * i.qty)}`)
    const text = `Halo NEXOGIL, saya ingin memesan:\n${lines.join('\n')}\n\nTotal: ${formatPrice(total)}`
    window.open(whatsappLink(text), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-[90] flex h-[100dvh] w-full max-w-[460px] flex-col border-l border-white/10 bg-carbon/95 backdrop-blur-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <h2 className="font-display text-xl font-semibold">
                Your cart <span className="text-silver/40">({count})</span>
              </h2>
              <button type="button" onClick={closeCart} aria-label="Close cart" className="grid size-10 place-items-center rounded-full hover:bg-white/10">
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <ShoppingBag className="size-12 text-silver/25" />
                <p className="font-display text-xl">Your cart is empty.</p>
                <p className="text-sm text-silver/50">Find the machine that moves your world.</p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    closeCart()
                    scrollToId('collection')
                  }}
                >
                  Explore Collection
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {items.map(({ id, qty, product }) => (
                      <motion.li
                        key={id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                        className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3"
                      >
                        <div className="w-24 shrink-0 self-center">
                          <CssLaptop accent={product.accent} open={1} />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">{product.name}</p>
                              <p className="truncate text-[11px] text-silver/45">
                                {product.ram} · {product.storage}
                              </p>
                            </div>
                            <button type="button" onClick={() => remove(id)} aria-label={`Remove ${product.name}`} className="grid size-8 shrink-0 place-items-center rounded-full text-silver/50 transition hover:bg-white/10 hover:text-red-400">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-white/10">
                              <button type="button" aria-label="Decrease quantity" onClick={() => setQty(id, qty - 1)} className="grid size-8 place-items-center hover:text-neon">
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">{qty}</span>
                              <button type="button" aria-label="Increase quantity" onClick={() => setQty(id, qty + 1)} disabled={qty >= 9} className="grid size-8 place-items-center hover:text-neon disabled:opacity-30">
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold">{formatPrice(product.price * qty)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="space-y-4 border-t border-white/[0.07] px-6 py-5">
                  <div className="flex items-center justify-between text-sm text-silver/60">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-silver/60">Total</span>
                    <motion.span key={total} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-semibold">
                      {formatPrice(total)}
                    </motion.span>
                  </div>
                  <Button className="w-full" onClick={checkout}>
                    <MessageCircle className="size-4" /> Checkout via WhatsApp
                  </Button>
                  <button type="button" onClick={clear} className="w-full text-center text-xs text-silver/40 transition hover:text-red-400">
                    Clear cart
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
