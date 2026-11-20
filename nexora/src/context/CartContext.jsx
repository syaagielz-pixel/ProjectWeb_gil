import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS_BY_ID } from '../data/products'

const STORAGE_KEY = 'nexogil-cart-v1'
const CartContext = createContext(null)

// Only { id, qty } is persisted; product data is always read fresh from the catalogue.
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter((i) => PRODUCTS_BY_ID[i?.id] && Number.isInteger(i.qty) && i.qty > 0)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(loadCart)
  const [isOpen, setOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* storage unavailable (private mode, quota) — cart still works in memory */
    }
  }, [lines])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const add = useCallback((product, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === product.id)
      if (found) return prev.map((l) => (l.id === product.id ? { ...l, qty: Math.min(l.qty + qty, 9) } : l))
      return [...prev, { id: product.id, qty }]
    })
    setToast({ product, key: Date.now() })
  }, [])

  const remove = useCallback((id) => setLines((prev) => prev.filter((l) => l.id !== id)), [])

  const setQty = useCallback(
    (id, qty) =>
      setLines((prev) =>
        qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 9) } : l)),
      ),
    [],
  )

  const clear = useCallback(() => setLines([]), [])
  const openCart = useCallback(() => setOpen(true), [])
  const closeCart = useCallback(() => setOpen(false), [])

  const value = useMemo(() => {
    const items = lines.map((l) => ({ ...l, product: PRODUCTS_BY_ID[l.id] }))
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.product.price, 0),
      isOpen,
      toast,
      dismissToast: () => setToast(null),
      add,
      remove,
      setQty,
      clear,
      openCart,
      closeCart,
    }
  }, [lines, isOpen, toast, add, remove, setQty, clear, openCart, closeCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
