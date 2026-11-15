import { SearchResults } from '@/components/Booking'
import { SiteLink } from '@/components/SiteLink'

/**
 * Where the Hospitable search bar sends guests (/search?checkin=...&checkout=...&adults=...).
 * The results widget reads the dates from the web address. Picking a cabin goes to its
 * cabin page, where the booking widget picks the same dates up from the address.
 */
export function SearchPage() {
  return (
    <section className="sec-mustard-tint on-tint section">
      <div className="container-x">
        <p className="eyebrow">Find your happy place</p>
        <h1 className="h-display mt-3">Cabins open for your dates</h1>
        <p className="lead mt-4 max-w-2xl">Pick a cabin to see the full price and book direct.</p>
        <div className="card mt-8 p-4 md:p-6">
          <SearchResults />
        </div>
        <p className="mt-8">
          <SiteLink to="/cabins" className="text-link font-bold">
            Browse all our cabins
          </SiteLink>
        </p>
      </div>
    </section>
  )
}
