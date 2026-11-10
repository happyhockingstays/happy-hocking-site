import { useRef } from 'react'
import type { CabinSummary } from '@/lib/types'
import { CabinCard } from './CabinCard'
import { RowArrows } from './Reviews'

/**
 * Big-photo cabin cards in a row that scrolls sideways (swipe on phones, arrows on desktop).
 * It shows whatever cabins are visible, so it survives cabins coming and going.
 */
export function CabinRow({ cabins }: { cabins: CabinSummary[] }) {
  const row = useRef<HTMLUListElement>(null)
  const step = (dir: 1 | -1) => {
    const el = row.current
    if (!el) return
    const card = el.querySelector('li')
    el.scrollBy({ left: dir * ((card?.getBoundingClientRect().width || 360) + 28), behavior: 'smooth' })
  }
  return (
    <div>
      <ul ref={row} className="bleed-row shadow-rotate gap-7">
        {cabins.map((c) => (
          <li key={c.slug} className="w-[84vw] max-w-[440px] sm:w-[400px] lg:w-[440px]">
            <CabinCard cabin={c} sizes="(min-width: 640px) 440px, 84vw" />
          </li>
        ))}
      </ul>
      <RowArrows onPrev={() => step(-1)} onNext={() => step(1)} label="cabins" />
    </div>
  )
}
