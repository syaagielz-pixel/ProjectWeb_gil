/** Tiny className joiner: cn('a', cond && 'b') */
export const cn = (...parts) => parts.filter(Boolean).join(' ')
