import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Toast() {
  const { toast, isOpen, openCart, dismissToast } = useCart()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[75] flex justify-center px-4">
      <AnimatePresence>
        {toast && !isOpen && (
          <motion.div
            key={toast.key}
            role="status"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass pointer-events-auto flex items-center gap-3 rounded-full py-2 pl-3 pr-2 text-sm shadow-2xl"
          >
            <span className="grid size-7 place-items-center rounded-full bg-neon text-ink">
              <Check className="size-4" />
            </span>
            <span className="max-w-[48vw] truncate text-white/90">{toast.product.name} added</span>
            <button
              type="button"
              onClick={() => {
                dismissToast()
                openCart()
              }}
              className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] transition hover:bg-neon hover:text-ink"
            >
              View cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
