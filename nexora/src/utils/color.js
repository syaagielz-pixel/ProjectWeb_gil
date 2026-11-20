/** "#27d8ff" + 0.4 -> "rgba(39, 216, 255, 0.4)" */
export function hexA(hex, alpha = 1) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}
