import type { CabinSummary } from '@/lib/types'
import { Icon } from './Icon'
import { Photo } from './Photo'
import { SiteLink } from './SiteLink'

/**
 * Big-photo cabin card: tagline eyebrow, name, card line and a few chips.
 * Put cards in a .shadow-rotate parent so the offset shadows cycle through the brand colors.
 * A collection page adds a note: why this cabin is on that page (its pool dates, its court).
 */
export function CabinCard({ cabin, note, sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' }: { cabin: CabinSummary; note?: string; sizes?: string }) {
  return (
    <SiteLink to={`/cabins/${cabin.slug}`} className="card card-link flex h-full flex-col overflow-hidden">
      <div className="card-photo relative">
        <Photo src={cabin.heroImage} alt={cabin.heroAlt || cabin.name} label={cabin.name} ratio="4 / 3" sizes={sizes} tint="mustard" />
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
