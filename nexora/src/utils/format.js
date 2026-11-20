const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export const formatPrice = (value) => idr.format(value)

/** Compact label for the price slider, e.g. "Rp 48 jt". */
export const formatMillions = (value) => `Rp ${Math.round(value / 1_000_000)} jt`
