export const EASE = [0.22, 1, 0.36, 1]

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
