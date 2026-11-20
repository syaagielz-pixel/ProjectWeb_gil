import { useCallback, useMemo, useState } from 'react'
import { PRICE_MAX, PRODUCTS } from '../data/products'

const DEFAULTS = {
  query: '',
  category: 'All',
  brands: [],
  gpuTypes: [],
  maxPrice: PRICE_MAX,
  sort: 'popular',
}

export function useProductFilter() {
  const [filters, setFilters] = useState(DEFAULTS)

  const update = useCallback((patch) => setFilters((f) => ({ ...f, ...patch })), [])

  /** Toggle a value inside an array filter ("brands" or "gpuTypes"). */
  const toggle = useCallback(
    (key, value) =>
      setFilters((f) => {
        const list = f[key]
        return {
          ...f,
          [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
        }
      }),
    [],
  )

  const reset = useCallback(() => setFilters(DEFAULTS), [])

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    const list = PRODUCTS.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        (filters.category === 'All' || p.categories.includes(filters.category)) &&
        (filters.brands.length === 0 || filters.brands.includes(p.brand)) &&
        (filters.gpuTypes.length === 0 || filters.gpuTypes.includes(p.gpuType)) &&
        p.price <= filters.maxPrice,
    )

    const sorters = {
      popular: (a, b) => b.popularity - a.popularity,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
    }
    return [...list].sort(sorters[filters.sort] ?? sorters.popular)
  }, [filters])

  const activeCount =
    (filters.query.trim() ? 1 : 0) +
    (filters.category !== 'All' ? 1 : 0) +
    filters.brands.length +
    filters.gpuTypes.length +
    (filters.maxPrice < PRICE_MAX ? 1 : 0)

  return { filters, update, toggle, reset, results, activeCount }
}
