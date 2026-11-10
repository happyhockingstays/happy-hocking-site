import { useEffect, useRef, useState } from 'react'
import { cabinBySlug, settings } from '@/lib/content'
import type { Review } from '@/lib/types'
import { Icon, Sparkle } from './Icon'
import { Photo } from './Photo'

export function Stars({ value, className = 'h-5 w-5' }: { value: number; className?: string }) {
  return (
    <span className="inline-flex text-terracotta-deep" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className={className} fill={value >= n - 0.25 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z" />
        </svg>
      ))}
    </span>
  )
}

/** Comments only at launch. Stars show when "Show star ratings" is on in Site settings. */
export function ReviewCard({ review: r, cabin, stars, photo }: { review: Review; cabin: string; stars: boolean; photo?: { src: string; alt: string } }) {
  return (
    <figure className="card flex h-full flex-col overflow-hidden">
      {photo?.src ? (
        <div className="card-photo">
          <Photo src={photo.src} alt={photo.alt} ratio="16 / 9" sizes="(min-width: 768px) 400px, 85vw" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {stars && r.rating ? <Stars value={r.rating} /> : <Sparkle className="h-6 w-6 text-mustard" />}
        <blockquote className="mt-3 flex-1 text-lg font-medium leading-snug">“{r.quote}”</blockquote>
        <figcaption className="meta mt-4 font-extrabold">{[r.firstName, cabin, r.stayed].filter(Boolean).join(' · ')}</figcaption>
      </div>
    </figure>
  )
}

/**
 * Homepage reviews: cards scroll sideways, each paired with a photo of its cabin.
 * The row moves on by itself every few seconds and pauses on hover, touch or keyboard focus.
 * It stays still for visitors who ask for reduced motion.
 */
export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const box = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLUListElement>(null)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)

  // Only move while the row is on screen, so it starts from the first review when a visitor reaches it.
  useEffect(() => {
    const el = box.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const step = (dir: 1 | -1) => {
    const el = row.current
    if (!el) return
    const card = el.querySelector('li')
    const by = (card?.getBoundingClientRect().width || 320) + 24
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
    else el.scrollBy({ left: dir * by, behavior: 'smooth' })
  }

  useEffect(() => {
    if (paused || !inView || reviews.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => step(1), 6000)
    return () => window.clearInterval(t)
  }, [paused, inView, reviews.length])

  return (
    <div ref={box} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <ul ref={row} className="bleed-row shadow-rotate gap-6">
        {reviews.map((r) => {
          const cabin = cabinBySlug(r.cabin)
          return (
            <li key={r.id} className="w-[84vw] max-w-[400px] sm:w-[400px]">
              <ReviewCard review={r} cabin={cabin?.shortName || ''} stars={settings.showStarRatings} photo={cabin ? { src: cabin.heroImage, alt: cabin.heroAlt || cabin.name } : undefined} />
            </li>
          )
        })}
      </ul>
      {reviews.length > 1 ? <RowArrows onPrev={() => step(-1)} onNext={() => step(1)} label="reviews" /> : null}
    </div>
  )
}

export function RowArrows({ onPrev, onNext, label }: { onPrev: () => void; onNext: () => void; label: string }) {
  return (
    <div className="mt-5 flex gap-3">
      <button type="button" className="btn btn-light !min-h-[44px] !px-3" onClick={onPrev} aria-label={`Previous ${label}`}>
        <Icon name="chevron-left" />
      </button>
      <button type="button" className="btn btn-light !min-h-[44px] !px-3" onClick={onNext} aria-label={`More ${label}`}>
        <Icon name="chevron-right" />
      </button>
    </div>
  )
}
