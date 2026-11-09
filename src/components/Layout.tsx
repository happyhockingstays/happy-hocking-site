import { useEffect, type ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileBar } from './MobileBar'
import { useCurrentPath } from './SiteLink'

/**
 * Fades and lifts elements marked data-reveal as they scroll into view.
 * Content is fully visible without JavaScript, and anything already on screen
 * when the page loads is left alone so nothing flickers.
 */
function useReveal(path: string) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    const seen = new WeakSet<Element>()
    const scan = () => {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in')
        else io.observe(el)
      })
    }
    scan()
    document.documentElement.classList.add('js')
    // Route components can mount after this effect (code splitting), so keep watching.
    let raf = 0
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(scan)
    })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [path])
}

export function Layout({ children }: { children: ReactNode }) {
  const path = useCurrentPath()
  useReveal(path)
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileBar />
    </>
  )
}
