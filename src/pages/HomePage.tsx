import { SearchWidget } from '@/components/Booking'
import { CabinCard } from '@/components/CabinCard'
import { Icon, Sparkle, type IconName } from '@/components/Icon'
import { SiteLink } from '@/components/SiteLink'
import { cabins, settings } from '@/lib/content'

/**
 * PLACEHOLDER HOMEPAGE. Step 3 of the first pass builds the real one from the brand guide
 * (hero video, proof strip, scrolling cabin row, story band, reviews, co-hosting band,
 * area band, FAQs, closing band). This version exists so the layout and cabin pages can be reviewed.
 */
export function HomePage() {
  const proof: [IconName, string][] = [
    ['star', `Every cabin rated ${settings.proof.rating} on Airbnb`],
    ['hot-tub', 'A private pool and hot tub at every cabin'],
    ['check', 'Book direct and skip the booking-site fees'],
  ]
  return (
    <>
      <section className="sec-forest on-forest -mt-[var(--header-h)] pb-16 pt-[calc(var(--header-h)+3rem)] md:pb-24 md:pt-[calc(var(--header-h)+5rem)]">
        <div className="container-x text-center">
          <p className="eyebrow">Hocking Hills, Ohio</p>
          <h1 className="h-display mx-auto mt-4 max-w-4xl">
            A place for <span className="accent">everyone</span> in the Hocking Hills
          </h1>
          <div className="card mx-auto mt-10 max-w-3xl p-4 md:p-5">
            <SearchWidget />
          </div>
        </div>
      </section>

      <section className="sec-mustard border-y-2 border-forest py-5">
        <ul className="container-x flex flex-col items-start gap-3 font-extrabold md:flex-row md:items-center md:justify-between">
          {proof.map(([icon, text]) => (
            <li key={text} className="flex items-center gap-2.5">
              <Icon name={icon} /> {text}
            </li>
          ))}
        </ul>
      </section>

      <section className="section sec-cream">
        <div className="container-x">
          <p className="eyebrow">Our cabins</p>
          <h2 className="h-section mt-2 flex items-center gap-3">
            Find your happy place <Sparkle className="h-7 w-7 text-mustard" />
          </h2>
          <ul className="shadow-rotate mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {cabins.map((c) => (
              <li key={c.slug} data-reveal>
                <CabinCard cabin={c} />
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center">
            <SiteLink to="/cabins" className="btn btn-book btn-lg">
              See all cabins
            </SiteLink>
          </p>
        </div>
      </section>
    </>
  )
}
