import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { scrollToId } from '../utils/scroll'
import { cn } from '../utils/cn'
import Logo from './ui/Logo'

const LINKS = [
  { id: 'categories', label: 'Categories' },
  { id: 'collection', label: 'Collection' },
  { id: 'flagship', label: 'Flagship' },
  { id: 'about', label: 'About' },
]

export default function Navbar({ onSearch }) {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const go = (id) => {
    setMenu(false)
    scrollToId(id)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'border-b border-white/[0.07] bg-ink/60 backdrop-blur-xl' : 'border-b border-transparent',
        )}
      >
        <nav className="mx-auto flex h-[72px] items-center justify-between px-6 lg:px-[6vw]" aria-label="Main">
          <button type="button" onClick={() => go('top')} aria-label="NEXOGIL — back to top" className="text-white">
            <Logo />
          </button>

          <ul className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => go(l.id)}
                  className={cn(
                    'relative py-2 text-[12px] uppercase tracking-[0.2em] transition-colors',
                    active === l.id ? 'text-white' : 'text-silver/60 hover:text-white',
                  )}
                >
                  {l.label}
                  {active === l.id && (
                    <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-neon" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onSearch}
              aria-label="Search laptops"
              className="grid size-11 place-items-center rounded-full text-silver transition hover:bg-white/10 hover:text-white"
            >
              <Search className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              className="relative grid size-11 place-items-center rounded-full text-silver transition hover:bg-white/10 hover:text-white"
            >
              <ShoppingBag className="size-[18px]" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 1.7 }}
                  animate={{ scale: 1 }}
                  className="absolute right-1 top-1 grid min-w-[18px] place-items-center rounded-full bg-neon px-1 text-[10px] font-bold leading-[18px] text-ink"
                >
                  {count}
                </motion.span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-full text-silver transition hover:bg-white/10 md:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-ink/95 px-6 py-5 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-[52px] items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setMenu(false)} aria-label="Close menu" className="grid size-11 place-items-center rounded-full hover:bg-white/10">
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-16 space-y-2">
              {LINKS.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}>
                  <button type="button" onClick={() => go(l.id)} className="font-display text-5xl font-semibold tracking-tight text-white/90 hover:text-neon">
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
