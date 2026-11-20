import { useEffect } from 'react'

/** While `active`: lock page scroll and close on Escape. */
export function useModalBehavior(active, onClose) {
  useEffect(() => {
    if (!active) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [active, onClose])
}
