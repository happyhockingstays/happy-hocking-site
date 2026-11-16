import { useEffect, useRef, useState } from 'react'
import type { CabinSummary } from '@/lib/types'
import { Icon } from './Icon'
import { Photo } from './Photo'
import { SiteLink } from './SiteLink'

/** How long each hover photo shows before the next one fades in. */
const CYCLE_MS = 2500

/**
 * Big-photo cabin card: tagline eyebrow, name, card line and a few chips.
 * Put cards in a .shadow-rotate parent so the offset shadows cycle through the brand colors.
 * A collection page adds a note: why this cabin is on that page (its pool dates, its court).
 *
 * Hover photos: on a computer, pointing at the card fades from the cover to the cabin's
 * card photos (Pages CMS: "Card photos on hover") and cycles through them every 2.5 seconds.
 * They load only on the first hover, so a page of cards costs no extra bandwidth until then.
 * Phones and tablets (no hover) keep the cover. Visitors who ask for reduced motion get the
 * first hover photo without the cycling.
 */
export function CabinCard({ cabin, note, sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' }: { cabin: CabinSummary; note?: string; sizes?: string }) {
  const extra = cabin.cardPhotos ?? []
  const [loaded, setLoaded] = useState(false)
  const [active, setActive] = useState(-1) // -1 is the cover
  const timer = useRef<number | undefined>(undefined)

  const stop = () => {
    window.clearInterval(timer.current)
    timer.current = undefined
    setActive(-1)
  }
  const start = () => {
    if (!extra.length || timer.current !== undefined) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    setLoaded(true)
    setActive(0)
    if (extra.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer.current = 0
      return
    }
    timer.current = window.setInterval(() => setActive((i) => (i + 1) % extra.length), CYCLE_MS)
  }
  useEffect(() => () => window.clearInterval(timer.current), [])

  return (
    <SiteLink to={`/cabins/${cabin.slug}`} className="card card-link flex h-full flex-col overflow-hidden" onMouseEnter={start} onMouseLeave={stop}>
      <div className="card-photo relative">
        <Photo src={cabin.cardImage || cabin.heroImage} alt={cabin.cardAlt || cabin.heroAlt || cabin.name} label={cabin.name} ratio="4 / 3" sizes={sizes} tint="mustard" />
        {loaded ? (
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {extra.map((p, i) => (
              <Photo
                key={p.image}
                src={p.image}
                alt=""
                sizes={sizes}
                tint="mustard"
                className={`card-hover-photo absolute inset-0 ${i === active ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            {extra.length > 1 ? (
              <span className={`card-hover-dots absolute inset-x-0 bottom-3 flex justify-center gap-1.5 ${active >= 0 ? 'opacity-100' : 'opacity-0'}`}>
                {extra.map((p, i) => (
                  <span key={p.image} className={`h-2 w-2 rounded-full border border-forest ${i === active ? 'bg-cream' : 'bg-cream/40'}`} />
                ))}
              </span>
            ) : null}
          </div>
        ) : null}
        {cabin.isNew ? <span className="chip chip-mustard absolute left-3 top-3">New</span> : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <p className="eyebrow">{cabin.tagline}</p>
        <h3 className="h-card">{cabin.name}</h3>
        <p className={note ? '' : 'flex-1'}>{cabin.cardLine}</p>
        {note ? <p className="meta flex-1 font-semibold">{note}</p> : null}
        <ul className="mt-3 flex flex-wrap gap-1.5">
          <li className="chip">
            <Icon name="users" /> Sleeps {cabin.sleeps}
          </li>
          {cabin.chips.slice(0, 3).map((c) => (
            <li key={c} className="chip">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </SiteLink>
  )
}
