import { SearchWidget } from '@/components/Booking'
import { CabinCard } from '@/components/CabinCard'
import { ClosingBand } from '@/components/ClosingBand'
import { FaqList } from '@/components/Faq'
import { Icon } from '@/components/Icon'
import { Photo } from '@/components/Photo'
import { SiteLink } from '@/components/SiteLink'
import { cabinBySlug, collections } from '@/lib/content'
import type { CabinSummary, Collection } from '@/lib/types'

/** The cabins on a collection page, in the page's own order, each with its note. */
export const collectionCabins = (p: Collection) =>
  p.cabins.map((c) => ({ cabin: cabinBySlug(c.slug), note: c.note })).filter((x): x is { cabin: CabinSummary; note: string } => Boolean(x.cabin))

/** Pool dates come from the cabin itself, so a date changed on a cabin shows here too. */
const poolLine = (c: CabinSummary) => (c.poolSeason ? `Pool open ${c.poolSeason}. ${c.poolNote}`.trim() : '')

/**
 * One template for the cabin collection pages: pools, large groups, games and sports, luxury.
 * The words, the cabin list and the questions come from content/collections/<slug>.yml
 * (Pages CMS: Cabin collection pages). Sleeps, bedrooms, towns and pool dates come from each cabin.
 * These pages are linked from the Cabins page and the footer, never the top menu.
 */
export function CollectionPage({ page: p }: { page: Collection }) {
  const list = collectionCabins(p)
  const others = collections.filter((c) => c.slug !== p.slug)

  return (
    <>
      <section className="sec-mustard-tint on-tint border-b-2 border-forest py-10 md:py-14">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="meta mb-4">
              <SiteLink to="/cabins" className="text-link inline-flex items-center gap-1.5">
                <Icon name="chevron-left" className="h-4 w-4" /> All cabins
              </SiteLink>
            </nav>
            {p.eyebrow ? <p className="eyebrow">{p.eyebrow}</p> : null}
            <h1 className="h-display mt-3 !text-[clamp(2.25rem,5.2vw,3.75rem)]">{p.title}</h1>
            {p.lead ? <p className="lead mt-4 max-w-2xl">{p.lead}</p> : null}
            <div className="card mt-8 max-w-3xl p-4 md:p-5">
              <SearchWidget />
            </div>
          </div>
          {p.image ? (
            <div className="frame lg:col-span-5">
              <Photo src={p.image} alt={p.alt} ratio="4 / 3" priority sizes="(min-width: 1024px) 40vw, 100vw" tint="mustard" />
            </div>
          ) : null}
        </div>
      </section>

      {/* The cabins */}
      <section className="section sec-cream">
        <div className="container-x">
          <div className="max-w-2xl" data-reveal>
            <h2 className="h-section">{p.listHeading}</h2>
            {p.listIntro ? <p className="lead mt-4">{p.listIntro}</p> : null}
          </div>
          <ul className="shadow-rotate mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(({ cabin, note }) => (
              <li key={cabin.slug}>
                <CabinCard cabin={cabin} note={[note, p.showPoolDates ? poolLine(cabin) : ''].filter(Boolean).join(' ')} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What to know */}
      {p.know.items.length ? (
        <section className="section sec-forest on-forest">
          <div className="container-x">
            <div className="max-w-2xl" data-reveal>
              {p.know.eyebrow ? <p className="eyebrow">{p.know.eyebrow}</p> : null}
              <h2 className="h-section mt-2">{p.know.heading}</h2>
            </div>
            <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {p.know.items.map((s) => (
                <li key={s.title} className="flex gap-4" data-reveal>
                  <span className="icon-tile">
                    <Icon name={s.icon} />
                  </span>
                  <div>
                    <h3 className="font-sans text-lg font-extrabold leading-snug">{s.title}</h3>
                    <p className="soft mt-1.5">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Side by side. Every number comes from the cabin files. */}
      {p.compare.heading ? (
        <section className="section sec-sage-tint on-tint">
          <div className="container-x">
            <div className="max-w-2xl" data-reveal>
              <h2 className="h-section">{p.compare.heading}</h2>
              {p.compare.intro ? <p className="lead mt-4">{p.compare.intro}</p> : null}
            </div>
            <div className="card mt-8 overflow-x-auto" data-reveal>
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-forest">
                    {['Cabin', 'Sleeps', 'Bedrooms', 'Town', 'Pool season'].map((h) => (
                      <th key={h} scope="col" className="eyebrow px-4 py-3.5 md:px-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map(({ cabin: c }) => (
                    <tr key={c.slug} className="border-b-2 border-forest/15 last:border-0">
                      <th scope="row" className="px-4 py-3.5 font-extrabold md:px-5">
                        <SiteLink to={`/cabins/${c.slug}`} className="text-link">
                          {c.name}
                        </SiteLink>
                      </th>
                      <td className="px-4 py-3.5 md:px-5">{c.sleeps}</td>
                      <td className="px-4 py-3.5 md:px-5">{c.bedrooms}</td>
                      <td className="px-4 py-3.5 md:px-5">{c.town}</td>
                      <td className="px-4 py-3.5 md:px-5">
                        {c.poolSeason}
                        {/heated to/i.test(c.poolNote) ? ', heated' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {/* Questions. The answers stay in the page HTML, with FAQ schema set in the route. */}
      {p.faqs.length ? (
        <section className="section sec-cream">
          <div className="container-x grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4" data-reveal>
              <p className="eyebrow">FAQs</p>
              <h2 className="h-section mt-2 !text-[clamp(1.625rem,3vw,2.25rem)]">{p.faqHeading}</h2>
              {p.guide.link && p.guide.text ? (
                <p className="mt-5">
                  {p.guide.text}{' '}
                  <SiteLink to={p.guide.link} className="text-link">
                    {p.guide.linkLabel}
                  </SiteLink>
                </p>
              ) : null}
            </div>
            <div className="lg:col-span-8" data-reveal>
              <FaqList items={p.faqs} />
            </div>
          </div>
        </section>
      ) : null}

      {/* The other collection pages, and the way back up to every cabin */}
      <section className="sec-terracotta-tint on-tint sec-line py-12 md:py-14">
        <div className="container-x">
          <h2 className="h-section !text-[clamp(1.625rem,3vw,2.25rem)]" data-reveal>
            More ways to pick a cabin
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3" data-reveal>
            {others.map((c) => (
              <li key={c.slug}>
                <SiteLink to={`/${c.slug}`} className="btn btn-light">
                  {c.linkText}
                </SiteLink>
              </li>
            ))}
            <li>
              <SiteLink to="/cabins" className="btn btn-forest">
                Hocking Hills cabin rentals
              </SiteLink>
            </li>
          </ul>
        </div>
      </section>

      <ClosingBand />
    </>
  )
}
