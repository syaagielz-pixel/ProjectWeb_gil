export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <defs>
          <linearGradient id="nx-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8aecff" />
            <stop offset="1" stopColor="#27d8ff" />
          </linearGradient>
        </defs>
        <path d="M7 25V7l18 18V7" fill="none" stroke="url(#nx-logo)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-display text-[17px] font-bold tracking-[0.34em]">NEXOGIL</span>
    </span>
  )
}
