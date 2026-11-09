import { useEffect, useState } from 'react'
import { settings } from '@/lib/content'
import { asset } from '@/lib/asset'
import { Icon } from './Icon'
import { SiteLink, useCurrentPath } from './SiteLink'

/** Links sit on both sides of the centered logo. Co-hosting has its own button, so it isn't repeated here. */
export const navLeft = [
  { to: '/cabins', label: 'Cabins' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/faqs', label: 'FAQs' },
]
export const navRight = [{ to: '/contact', label: 'Contact' }]

/** Pages that open on a full-bleed photo or video: the header starts clear, with the reversed logo. */
const overlayPages = ['/', '/co-hosting']

/** "Check availability" jumps to the booking widget on a cabin page, and to the cabin search everywhere else. */
export function useBookTarget() {
  const path = useCurrentPath()
  return /^\/cabins\/[^/]+$/.test(path) ? { onCabin: true as const } : { onCabin: false as const }
}

export function BookLink({ className, children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) {
  const { onCabin } = useBookTarget()
  if (onCabin)
    return (
      <a href="#book" className={className} onClick={onClick}>
        {children}
      </a>
    )
  return (
    <SiteLink to="/cabins" className={className} onClick={onClick}>
      {children}
    </SiteLink>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const path = useCurrentPath()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const clear = overlayPages.includes(path) && !scrolled
  const linkCls = (to: string) => {
    const active = path === to || path.startsWith(to + '/')
    return `relative py-2 text-[0.9375rem] font-bold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      active ? 'after:scale-x-100' : 'after:scale-x-0'
    } ${clear ? 'text-cream' : 'text-forest hover:text-terracotta-deep'}`
  }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:font-bold">
        Skip to content
      </a>

      {settings.banner.show && settings.banner.text ? (
        <div className="on-forest bg-forest px-4 py-2 text-center text-[0.8125rem] font-bold text-cream">
          {settings.banner.link ? (
            <SiteLink to={settings.banner.link} className="underline-offset-4 hover:underline">
              {settings.banner.text}
            </SiteLink>
          ) : (
            settings.banner.text
          )}
        </div>
      ) : null}

      {/* The sticky box keeps one height so the page never jumps. Only the bar inside it shrinks on scroll. */}
      <div className={`pointer-events-none sticky top-0 z-50 h-[var(--header-h)] ${clear ? 'on-forest' : ''}`}>
        <header
          className={`pointer-events-auto transition-[background-color,box-shadow,border-color] duration-300 ${
            clear ? 'border-b-2 border-transparent' : 'border-b-2 border-forest bg-cream'
          }`}
        >
          <div className="container-x grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 lg:gap-6">
            {/* left */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className={`-ml-2 flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${clear ? 'text-cream' : 'text-forest'}`}
                aria-label="Open menu"
                aria-expanded={open}
              >
                <Icon name="menu" className="h-7 w-7" />
              </button>
              <nav aria-label="Main" className="hidden items-center gap-6 lg:flex xl:gap-8">
                {navLeft.map((n) => (
                  <SiteLink key={n.to} to={n.to} className={linkCls(n.to)}>
                    {n.label}
                  </SiteLink>
                ))}
              </nav>
            </div>

            {/* logo: the wordmark is artwork, never retyped. Under 64px tall it swaps to the monogram. */}
            <SiteLink to="/" aria-label="Happy Hocking Stays, home" className="block py-2 lg:py-3">
              <img
                src={asset(clear ? '/images/brand/wordmark-reversed.svg' : '/images/brand/wordmark.svg')}
                alt="Happy Hocking Stays"
                width={468}
                height={246}
                className={`w-auto transition-[height] duration-300 ${scrolled ? 'hidden h-16 lg:block' : 'h-[4.5rem] lg:h-[5.5rem]'}`}
              />
              <img
                src={asset('/images/brand/monogram.svg')}
                alt="Happy Hocking Stays"
                width={118}
                height={116}
                className={`h-11 w-auto lg:hidden ${scrolled ? 'block' : 'hidden'}`}
              />
            </SiteLink>

            {/* right */}
            <div className="flex items-center justify-end gap-3 lg:gap-4 xl:gap-6">
              <nav aria-label="More" className="hidden items-center gap-7 lg:flex">
                {navRight.map((n) => (
                  <SiteLink key={n.to} to={n.to} className={linkCls(n.to)}>
                    {n.label}
                  </SiteLink>
                ))}
              </nav>
              <SiteLink to="/co-hosting" className="btn btn-cohost btn-sm xl:!min-h-[48px] xl:!px-5 xl:!text-base">
                <span className="hidden sm:inline">Co-host with us</span>
                <span className="sm:hidden">Co-host</span>
              </SiteLink>
              <BookLink className="btn btn-book btn-sm hidden lg:inline-flex xl:!min-h-[48px] xl:!px-5 xl:!text-base">Check availability</BookLink>
            </div>
          </div>
        </header>
      </div>

      {/* mobile menu */}
      <div
        className={`on-forest fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-forest text-cream transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="container-x flex items-center justify-between py-3">
          <img src={asset('/images/brand/wordmark-reversed.svg')} alt="" width={468} height={246} className="h-16 w-auto" />
          <button type="button" onClick={() => setOpen(false)} className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full" aria-label="Close menu">
            <Icon name="x" className="h-7 w-7" />
          </button>
        </div>
        <nav className="container-x mt-4 flex flex-col" aria-label="Mobile">
          {[{ to: '/', label: 'Home' }, ...navLeft, ...navRight].map((n) => (
            <SiteLink key={n.to} to={n.to} className="font-display border-b-2 border-cream/15 py-3.5 text-[1.75rem] leading-tight" onClick={() => setOpen(false)}>
              {n.label}
            </SiteLink>
          ))}
        </nav>
        <div className="container-x mt-auto grid gap-3 pb-10 pt-8">
          <BookLink className="btn btn-book btn-lg w-full" onClick={() => setOpen(false)}>
            Check availability
          </BookLink>
          <SiteLink to="/co-hosting" className="btn btn-cohost btn-lg w-full" onClick={() => setOpen(false)}>
            Co-host with us
          </SiteLink>
        </div>
      </div>
    </>
  )
}
