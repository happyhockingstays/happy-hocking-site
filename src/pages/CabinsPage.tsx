import { useState } from 'react'
import { SearchWidget } from '@/components/Booking'
import { CabinCard } from '@/components/CabinCard'
import { Icon } from '@/components/Icon'
import { cabins, isLargeGroup } from '@/lib/content'

type Size = 'all' | 'small' | 'large'

const sizes: { key: Size; label: string }[] = [
  { key: 'all', label: 'Any group size' },
  { key: 'small', label: 'Couples and small groups' },
  { key: 'large', label: 'Large groups, 13 or more' },
]

/** Every cabin as a big-photo card, with filters for group size and for games and sports. */
export function CabinsPage() {
  const [size, setSize] = useState<Size>('all')
  const [games, setGames] = useState(false)
  const list = cabins.filter((c) => (size === 'all' || (size === 'large') === isLargeGroup(c)) && (!games || c.gamesAndSports))

  return (
    <>
      <section className="sec-mustard-tint on-tint border-b-2 border-forest py-10 md:py-14">
        <div className="container-x">
          <p className="eyebrow">Find your happy place</p>
          <h1 className="h-display mt-3">Hocking Hills cabins</h1>
          <p className="lead mt-4 max-w-2xl">A private pool and hot tub at every cabin, and room for groups of 6 to 29. Pick your dates, then pick your place.</p>
          <div className="card mt-8 max-w-3xl p-4 md:p-5">
            <SearchWidget />
          </div>
        </div>
      </section>

      <section className="section sec-cream">
        <div className="container-x">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter cabins">
            {sizes.map((s) => (
              <button key={s.key} type="button" className="chip !px-4 !py-2.5 !text-sm" aria-pressed={size === s.key} onClick={() => setSize(s.key)}>
                {s.label}
              </button>
            ))}
            <button type="button" className="chip !px-4 !py-2.5 !text-sm" aria-pressed={games} onClick={() => setGames((g) => !g)}>
              <Icon name="pickleball" /> Games and sports
            </button>
          </div>

          <ul className="shadow-rotate mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <li key={c.slug}>
                <CabinCard cabin={c} />
              </li>
            ))}
          </ul>
          {list.length === 0 ? <p className="lead mt-8">No cabins match both filters. Try clearing one.</p> : null}
        </div>
      </section>
    </>
  )
}
