import { useEffect, useRef, type ReactNode } from 'react'

/**
 * A full-bleed photo band that drifts slightly slower than the page as it scrolls by.
 * The photo is a little taller than its window so there is room to move. No drift for
 * visitors who ask for reduced motion, and the scroll itself is never taken over.
 */
export function Drift({ children, className = '' }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const b = box.current
      const i = inner.current
      if (!b || !i) return
      const r = b.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      // -1 when the band is just below the screen, +1 when it has just left the top
      const t = (r.top + r.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2 + r.height / 2)
      i.style.transform = `translate3d(0, ${(-t * 6).toFixed(2)}%, 0)`
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div ref={box} className={`absolute inset-0 overflow-hidden ${className}`}>
      <div ref={inner} className="absolute inset-x-0 -bottom-[8%] -top-[8%] will-change-transform">
        {children}
      </div>
    </div>
  )
}
