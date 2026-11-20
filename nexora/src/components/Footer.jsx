import { Instagram, MessageCircle } from 'lucide-react'
import Logo from './ui/Logo'
import { SITE, whatsappLink } from '../config/site'
import { scrollToId } from '../utils/scroll'

function TikTokIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 3c.3 2.3 1.6 3.7 3.9 3.9v3.1c-1.4.1-2.7-.3-3.9-1.1v6.1c0 3.9-3.2 6.2-6.3 5.7-3-.5-5-3.3-4.4-6.4.6-3 3.4-4.8 6.3-4.3v3.2c-1.6-.5-3.2.5-3.3 2-.2 1.9 1.7 3.2 3.3 2.4.8-.4 1.2-1.1 1.2-2.1V3h3.2z" />
    </svg>
  )
}

const btn = 'text-left text-sm text-silver/60 transition hover:text-white'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] px-6 pb-8 pt-20 lg:px-[6vw]">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <button type="button" onClick={() => scrollToId('about')} className="text-white">
            <Logo />
          </button>
          <h3 className="mt-6 text-[11px] uppercase tracking-[0.28em] text-silver/40">About NEXOGIL</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-silver/60">
            A futuristic showroom for people who demand more from their machines. Curated laptops, honest advice, real support.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-[11px] uppercase tracking-[0.28em] text-silver/40">Products</h3>
          <ul className="space-y-3">
            <li><button type="button" className={btn} onClick={() => scrollToId('collection')}>All Laptops</button></li>
            <li><button type="button" className={btn} onClick={() => scrollToId('categories')}>Categories</button></li>
            <li><button type="button" className={btn} onClick={() => scrollToId('flagship')}>Flagship</button></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-[11px] uppercase tracking-[0.28em] text-silver/40">Customer Support</h3>
          <ul className="space-y-3">
            <li>
              <a className={btn} href={whatsappLink('Halo NEXOGIL, saya butuh bantuan.')} target="_blank" rel="noopener noreferrer">
                Chat with support
              </a>
            </li>
            <li>
              <a className={btn} href={`mailto:${SITE.email}?subject=Warranty%20%26%20Service`}>
                Warranty &amp; service
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-[11px] uppercase tracking-[0.28em] text-silver/40">Contact</h3>
          <a className={btn} href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
          <div className="mt-6 flex gap-2">
            {[
              { label: 'Instagram', href: SITE.instagram, icon: <Instagram className="size-[18px]" /> },
              { label: 'TikTok', href: SITE.tiktok, icon: <TikTokIcon className="size-[18px]" /> },
              { label: 'WhatsApp', href: whatsappLink(), icon: <MessageCircle className="size-[18px]" /> },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid size-11 place-items-center rounded-full border border-white/10 text-silver transition hover:border-neon hover:text-neon"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="pointer-events-none mt-20 select-none text-center font-display text-[clamp(4rem,21vw,20rem)] font-bold leading-[0.8] tracking-[-0.05em] text-stroke opacity-60" aria-hidden="true">
        NEXOGIL
      </p>

      <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/[0.07] pt-6 text-xs text-silver/40 sm:flex-row">
        <p>© {new Date().getFullYear()} NEXOGIL Tech. All rights reserved.</p>
        <p>Power beyond limits.</p>
      </div>
    </footer>
  )
}
