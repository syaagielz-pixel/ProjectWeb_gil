import { ArrowRight } from 'lucide-react'
import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'bg-neon text-ink hover:-translate-y-0.5 hover:shadow-[0_0_44px_-6px_rgba(39,216,255,0.8)]',
  ghost: 'border border-white/15 bg-white/[0.04] text-white backdrop-blur-md hover:border-neon/60 hover:bg-white/[0.08]',
}
const SIZES = { md: 'px-7 py-4 text-[12px]', sm: 'px-4 py-2.5 text-[11px]' }

export default function Button({ variant = 'primary', size = 'md', arrow = false, className, children, ...rest }) {
  return (
    <button
      type="button"
      className={cn(
        'group/btn inline-flex items-center justify-center gap-2.5 rounded-full font-medium uppercase tracking-[0.16em] transition-all duration-500 disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform duration-500 group-hover/btn:translate-x-1" />}
    </button>
  )
}
