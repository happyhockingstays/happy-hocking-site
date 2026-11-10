import { useEffect, useState } from 'react'
import { SearchWidget } from '@/components/Booking'
import { CabinCard } from '@/components/CabinCard'
import { Icon } from '@/components/Icon'
import { SiteLink } from '@/components/SiteLink'
import { cabins, isLargeGroup } from '@/lib/content'

type Size = 'all' | 'small' | 'large'

const sizes: { key: Size; label: string }[] = [
  { key: 'all', label: 'Any group size' },
  { key: 'small', label: 'Couples and small groups' },
  { key: 'large', label: 'Large groups, 13 or more' },
]

/**
 * Every cabin as a big-photo card, with filters for group size and for games and sports.
 * The filters live in the web address too, so a filtered view can be linked or shared:
 * /cabins?group=large, /cabins?group=small, /cabins?games=1
 */
export function CabinsPage() {
  const [size, setSize] = useState<Size>('all')
  const [games, setGames] = useState(false)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const g = q.get('group')
    if (g === 'small' || g === 'large') setSize(g)
    if (q.get('games') === '1') setGames(true)
  }, [])
  const update = (nextSize: Size, nextGames: boolean) => {
    setSize(nextSize)
    setGames(nextGames)
    const q = new URLSearchParams()
    if (nextSize !== 'all') q.set('group', nextSize)
    if (nextGames) q.set('games', '1')
    const qs = q.toString()
    window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''))
  }
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
              <button key={s.key} type="button" className="chip !px-4 !py-2.5 !text-sm" aria-pressed={size === s.key} onClick={() => update(s.key, games)}>
                {s.label}
              </button>
            ))}
            <button type="button" className="chip !px-4 !py-2.5 !text-sm" aria-pressed={games} onClick={() => update(size, !games)}>
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

      <section className="sec-sage-tint on-tint sec-line py-12 md:py-14">
        <div className="container-x flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div data-reveal>
            <h2 className="h-section !text-[clamp(1.625rem,3vw,2.25rem)]">Not sure which cabin fits your group?</h2>
            <p className="lead mt-2">Tell us who's coming and what you want to do. We'll point you to the right one.</p>
          </div>
          <SiteLink to="/contact" className="btn btn-forest btn-lg shrink-0" data-reveal>
            Happy to help
          </SiteLink>
        </div>
      </section>
    </>
  )
}
