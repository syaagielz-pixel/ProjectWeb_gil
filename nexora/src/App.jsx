import { useCallback, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { useProductFilter } from './hooks/useProductFilter'
import { scrollToId } from './utils/scroll'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import ProductShowcase from './components/ProductShowcase'
import Featured from './components/Featured'
import About from './components/About'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ProductModal from './components/ProductModal'
import Toast from './components/Toast'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-neon" />
}

export default function App() {
  const shop = useProductFilter()
  const [detail, setDetail] = useState(null)
  const closeDetail = useCallback(() => setDetail(null), [])

  const pickCategory = (id) => {
    shop.update({ category: id })
    scrollToId('collection')
  }

  const focusSearch = () => {
    scrollToId('collection')
    setTimeout(() => document.getElementById('product-search')?.focus({ preventScroll: true }), 700)
  }

  return (
    <CartProvider>
      <div className="grain relative min-h-screen bg-ink text-white">
        <ScrollProgress />
        <Navbar onSearch={focusSearch} />
        <main>
          <Hero />
          <Categories onSelect={pickCategory} />
          <ProductShowcase shop={shop} onDetails={setDetail} />
          <Featured onDetails={setDetail} />
          <About />
        </main>
        <Footer />
        <CartDrawer />
        <Toast />
        <AnimatePresence>{detail && <ProductModal key={detail.id} product={detail} onClose={closeDetail} />}</AnimatePresence>
      </div>
    </CartProvider>
  )
}
