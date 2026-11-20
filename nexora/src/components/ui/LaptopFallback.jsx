import CssLaptop from './CssLaptop'
import { hexA } from '../../utils/color'

/** Shown while the 3D bundle loads, or when WebGL is unavailable. */
export default function LaptopFallback({ accent = '#27d8ff', align = 'right' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-end justify-center pb-[8%] lg:items-center lg:pb-0 ${
        align === 'right' ? 'lg:justify-end lg:pr-[6%]' : ''
      }`}
    >
      <div
        className="absolute h-[60%] w-[60%] rounded-full blur-3xl"
        style={{ background: hexA(accent, 0.18) }}
      />
      <CssLaptop accent={accent} open={1} className="relative w-[85%] max-w-[640px]" />
    </div>
  )
}
