import { SearchResults } from '@/components/Booking'
import { SiteLink } from '@/components/SiteLink'

/**
 * Where the Hospitable search bar sends guests (/search?checkin=...&checkout=...&adults=...).
 * The results widget reads the dates from the web address. Picking a cabin goes to its
 * cabin page, where the booking widget picks the same dates up from the address.
 *
 * The results widget draws its own full-width search band, so it sits in the page
 * container rather than in a card. overflow-x-clip stops that band from adding a sideways
 * scroll without clipping the date picker.
 */
export function SearchPage() {
  return (
    <>
      <section className="sec-mustard-tint on-tint border-b-2 border-forest py-10 md:py-14">
        <div className="container-x">
          <p className="eyebrow">Find your happy place</p>
          <h1 className="h-display mt-3">Cabins open for your dates</h1>
          <p className="lead mt-4 max-w-2xl">Pick a cabin to see the full price and book direct.</p>
        </div>
      </section>
      <section className="sec-cream overflow-x-clip pb-14">
        <div className="container-x">
          <SearchResults />
        </div>
        <div className="container-x mt-8">
          <SiteLink to="/cabins" className="text-link font-bold">
            Browse all our cabins
          </SiteLink>
        </div>
      </section>
    </>
  )
}
