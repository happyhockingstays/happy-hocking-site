import { cabinBySlug, policies, settings } from '@/lib/content'
import type { Cabin, Review, Room } from '@/lib/types'
import { BookingCard } from '@/components/Booking'
import { CabinCard } from '@/components/CabinCard'
import { FaqList } from '@/components/Faq'
import { Gallery } from '@/components/Gallery'
import { Icon, Sparkle, type IconName } from '@/components/Icon'
import { Photo } from '@/components/Photo'
import { SiteLink } from '@/components/SiteLink'

/**
 * The one template behind every cabin page. All of the words, photos and facts come from
 * content/cabins/<slug>.yml (edited in Pages CMS); shared policies come from
 * content/settings/policies.yml. Section order follows the brand guide's cabin page list.
 */
export function CabinPage({ cabin: c }: { cabin: Cabin }) {
  const similar = c.similar.map(cabinBySlug).filter((x): x is NonNullable<typeof x> => Boolean(x)).slice(0, 2)
  const checkOut = c.checkOut || policies.checkOut
  const cancel = policies.cancellation[c.cancellation]
  const showStars = settings.showStarRatings && c.ratingSummary

  return (
    <>
      {/* 1 and 2. Gallery first, then name, tagline, stats and the booking widget */}
      <section className="sec-cream pb-12 pt-4 md:pb-20 md:pt-6">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="meta mb-4 font-bold">
            <SiteLink to="/cabins" className="text-link">
              All cabins
            </SiteLink>{' '}
            <span aria-hidden="true">/</span> {c.name}
          </nav>

          <Gallery cabin={c.name} hero={{ image: c.heroImage, alt: c.heroAlt || c.name }} keyShots={c.keyShots} groups={c.gallery} />

          <div className="mx-auto mt-10 max-w-3xl text-center md:mt-14">
            <p className="eyebrow">
              {c.tagline}
              {c.isNew ? ' · New' : ''}
            </p>
            <h1 className="h-display mt-3">{c.name}</h1>
            <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
              <span className="inline-flex items-center gap-1.5 font-bold">
                <Icon name="pin" className="h-5 w-5" /> {c.town}, Ohio
              </span>
              {c.airbnbRating ? (
                <span className="inline-flex items-center gap-2.5 font-medium">
                  <Sparkle className="hidden h-2.5 w-2.5 text-mustard sm:block" />
                  {c.airbnbRating} on Airbnb{c.airbnbReviews ? `, ${c.airbnbReviews} reviews` : ''}
                </span>
              ) : null}
            </p>
            {showStars && c.ratingSummary ? (
              <a href="#reviews" className="mt-2 inline-flex items-center gap-2 font-bold">
                <Stars value={c.ratingSummary.average} />
                <span className="text-link">
                  {c.ratingSummary.average.toFixed(1)} · {c.ratingSummary.count} {c.ratingSummary.count === 1 ? 'review' : 'reviews'}
                </span>
              </a>
            ) : null}
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              <li className="chip chip-mustard">
                <Icon name="users" /> Sleeps {c.sleeps}
              </li>
              <li className="chip chip-mustard">
                <Icon name="bed" /> {c.bedrooms} bedrooms
              </li>
              <li className="chip chip-mustard">
                <Icon name="bath" /> {c.baths} baths
              </li>
              {c.chips.map((chip) => (
                <li key={chip} className="chip">
                  {chip}
                </li>
              ))}
            </ul>
            {c.blurb ? <p className="lead mx-auto mt-6 max-w-2xl">{c.blurb}</p> : null}
          </div>

          <div className="mt-10">
            <BookingCard cabin={c.name} code={c.bookingWidget} />
          </div>
        </div>
      </section>

      {/* 3. Why you'll love it: the top amenities as photo tiles */}
      {c.highlights.length ? (
        <section className="section sec-sage-tint sec-lines on-tint">
          <div className="container-x">
            <h2 className="h-section" data-reveal>
              Why you'll love it
            </h2>
            <ul className="shadow-rotate mt-8 grid grid-cols-2 gap-4 md:mt-10 md:gap-7 lg:grid-cols-3">
              {c.highlights.map((h, i) => (
                <li key={h.title} className="card flex flex-col overflow-hidden" data-reveal style={{ '--reveal-delay': `${(i % 3) * 80}ms` } as React.CSSProperties}>
                  <div className="card-photo">
                    <Photo src={h.image} alt={h.alt || `${h.title} at ${c.name}`} label={h.title} ratio="4 / 3" sizes="(min-width: 1024px) 33vw, 50vw" tint={(['mustard', 'terracotta', 'sage'] as const)[i % 3]} />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="h-small md:text-[1.375rem]">{h.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] md:text-base">{h.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 4. About this home */}
      {c.about ? (
        <section className="section sec-cream">
          <div className="container-x grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4" data-reveal>
              <p className="eyebrow">{c.town}, Ohio</p>
              <h2 className="h-section mt-2">About this home</h2>
            </div>
            <div className="prose-site max-w-[65ch] lg:col-span-8" data-reveal>
              <Paragraphs text={c.about} />
              {c.aboutMore ? (
                <details className="group mt-4">
                  <summary className="text-link inline-flex cursor-pointer list-none items-center gap-1.5 [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">Read more</span>
                    <span className="hidden group-open:inline">Show less</span>
                  </summary>
                  <div className="prose-site mt-4">
                    <Paragraphs text={c.aboutMore} />
                  </div>
                </details>
              ) : null}
              {c.permit ? <p className="meta mt-6 opacity-80">{c.permit}</p> : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* 5. Where everyone sleeps */}
      {c.rooms.length ? (
        <section className="section sec-mustard-tint sec-lines on-tint">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
              <h2 className="h-section">Where everyone sleeps</h2>
              <p className="chip">
                <Icon name="bed" /> {c.bedrooms} bedrooms · {c.beds} beds · sleeps {c.sleeps}
              </p>
            </div>
            {c.rooms.length <= 4 ? <RoomCards rooms={c.rooms} cabin={c.name} /> : <SleepingPlan rooms={c.rooms} />}
            {c.sleepingNote ? (
              <p className="meta mt-6 max-w-[65ch]" data-reveal>
                {c.sleepingNote}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 6. Amenities: the best ones as an icon grid, the full list behind "See all amenities" */}
      {c.amenities.length ? (
        <section className="section sec-cream">
          <div className="container-x">
            <h2 className="h-section" data-reveal>
              Amenities
            </h2>
            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {c.amenities.map((g) => (
                <div key={g.group} data-reveal>
                  <h3 className="eyebrow">{g.group}</h3>
                  <ul className="mt-4 grid gap-3.5">
                    {g.items.map((a) => (
                      <li key={a.label} className="flex items-center gap-3 font-semibold leading-snug">
                        <span className="icon-tile shadow-mustard">
                          <Icon name={a.icon} />
                        </span>
                        {a.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {c.poolSeason ? (
              <p className="mt-8 flex max-w-[65ch] items-start gap-2.5" data-reveal>
                <Sparkle className="mt-1.5 h-4 w-4 shrink-0 text-terracotta-deep" />
                <span>
                  <strong>Pool season:</strong> {c.poolSeason}. {c.poolNote}
                </span>
              </p>
            ) : null}
            {c.allAmenities.length ? (
              <details className="group mt-8" data-reveal>
                <summary className="btn btn-light inline-flex cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">See all amenities</span>
                  <span className="hidden group-open:inline">Hide the full list</span>
                </summary>
                <div className="card mt-6 grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                  {c.allAmenities.map((g) => (
                    <div key={g.group}>
                      <h3 className="eyebrow">{g.group}</h3>
                      <p className="mt-2 text-[0.9375rem]">{g.items.join(' · ')}</p>
                    </div>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 7. The area nearby */}
      <section className="section sec-forest on-forest">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div data-reveal>
            <p className="eyebrow">Hocking Hills, Ohio</p>
            <h2 className="h-section mt-2">
              The area <span className="accent">nearby</span>
            </h2>
            {c.areaNote ? <p className="soft lead mt-4 max-w-[52ch]">{c.areaNote}</p> : null}
            {c.driveTimes.length ? (
              <dl className="mt-6 max-w-md">
                {c.driveTimes.map((t) => (
                  <div key={t.place} className="flex items-center justify-between gap-6 border-b-2 border-cream/15 py-3">
                    <dt className="flex items-center gap-2.5 font-bold">
                      <Icon name="pin" className="h-5 w-5 text-mustard" /> {t.place}
                    </dt>
                    <dd className="font-extrabold text-mustard">{t.time}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <p className="meta soft mt-5">The exact address comes with your booking confirmation.</p>
          </div>
          <div data-reveal>
            {/* Placeholder until the area map is drawn. Town level only: street addresses stay private. */}
            <div className="frame">
              <Photo src="" alt={`Map of ${c.name} and the Hocking Hills trails`} emptyText="Map: the cabin and the trails" ratio="4 / 3" tint="sage" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Guest reviews. Hidden until this cabin has a published review, so nothing looks empty. */}
      {c.reviews.length ? (
        <section id="reviews" className="section sec-cream scroll-mt-24">
          <div className="container-x">
            <p className="eyebrow" data-reveal>
              Guest reviews
            </p>
            <h2 className="h-section mt-2" data-reveal>
              Happy guests, happy homes
            </h2>
            <ul className="shadow-rotate mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {c.reviews.slice(0, 6).map((r) => (
                <li key={r.id} data-reveal>
                  <ReviewCard review={r} cabin={c.shortName} stars={settings.showStarRatings} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 9. Good to know */}
      <section className="section sec-terracotta-tint sec-lines on-tint">
        <div className="container-x">
          <h2 className="h-section" data-reveal>
            Good to know
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Tile icon="check-in" label="Check-in" value={policies.checkIn} />
            <Tile icon="check-out" label="Check-out" value={checkOut} />
            <Tile icon="calendar" label="Minimum stay" value={policies.minStay} note={policies.minStayNote} />
            {c.quietHours ? <Tile icon="quiet" label="Quiet hours" value={c.quietHours} /> : null}
            <Tile icon="age" label="Age to book" value={policies.ageToBook} note={policies.ageNote} />
            {c.poolSeason ? <Tile icon="pool" label="Pool season" value={c.poolSeason} note={c.poolNote} /> : null}
          </ul>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="card p-6" data-reveal>
              <h3 className="h-small flex items-center gap-3">
                <span className="icon-tile">
                  <Icon name="rules" />
                </span>
                House rules
              </h3>
              <ul className="sparkle-list mt-4">
                <li>
                  <Sparkle />
                  <span>Up to {c.sleeps} guests</span>
                </li>
                {[...policies.houseRules, ...c.extraRules].map((r) => (
                  <li key={r}>
                    <Sparkle />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid content-start gap-6">
              {c.goodToKnow.length ? (
                <div className="card p-6" data-reveal>
                  <h3 className="h-small flex items-center gap-3">
                    <span className="icon-tile">
                      <Icon name="info" />
                    </span>
                    Before you arrive
                  </h3>
                  <ul className="sparkle-list mt-4">
                    {c.goodToKnow.map((r) => (
                      <li key={r}>
                        <Sparkle />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {cancel.summary ? (
                <div className="card p-6" data-reveal>
                  <h3 className="h-small flex items-center gap-3">
                    <span className="icon-tile">
                      <Icon name="calendar" />
                    </span>
                    Cancellation
                  </h3>
                  <p className="mt-4">{cancel.summary}</p>
                  {cancel.details ? <p className="meta mt-2">{cancel.details}</p> : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Questions about this cabin */}
      {c.faqs.length ? (
        <section className="section sec-cream">
          <div className="container-x grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4" data-reveal>
              <p className="eyebrow">Happy to help</p>
              <h2 className="h-section mt-2">Questions about {c.shortName}</h2>
              <p className="mt-4">
                Something we didn't cover?{' '}
                <SiteLink to="/contact" className="text-link">
                  Send us a message
                </SiteLink>{' '}
                and we'll get right back to you.
              </p>
            </div>
            <div className="lg:col-span-8" data-reveal>
              <FaqList items={c.faqs} />
            </div>
          </div>
        </section>
      ) : null}

      {/* 11. Closing band: Book now jumps back up to this cabin's booking widget */}
      <section className="sec-mustard sec-lines py-12 md:py-16">
        <div className="container-x flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div data-reveal>
            <h2 className="h-display !text-[clamp(2.25rem,5vw,3.75rem)]">Find your happy place</h2>
            <p className="lead mt-2">Book {c.shortName} direct and skip the booking-site service fees.</p>
          </div>
          <a href="#book" className="btn btn-book btn-lg shrink-0" data-reveal>
            Book now
          </a>
        </div>
      </section>

      {/* 12. Two similar cabins, with photos */}
      {similar.length ? (
        <section className="section sec-sage-tint on-tint">
          <div className="container-x">
            <p className="eyebrow" data-reveal>
              More places to stay
            </p>
            <h2 className="h-section mt-2" data-reveal>
              Not quite right? Try another
            </h2>
            <div className="shadow-rotate mt-8 grid gap-7 md:grid-cols-2">
              {similar.map((s) => (
                <div key={s.slug} data-reveal>
                  <CabinCard cabin={s} sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
              ))}
            </div>
            <p className="mt-8" data-reveal>
              <SiteLink to="/cabins" className="btn btn-forest">
                See all cabins
              </SiteLink>
            </p>
          </div>
        </section>
      ) : null}
    </>
  )
}

/* ------------------------------------------------------------ pieces */

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </>
  )
}

function Tile({ icon, label, value, note }: { icon: IconName; label: string; value: string; note?: string }) {
  return (
    <li className="card flex items-start gap-4 p-5" data-reveal>
      <span className="icon-tile bg-mustard-tint">
        <Icon name={icon} />
      </span>
      <div>
        <p className="eyebrow">{label}</p>
        <p className="mt-1 text-xl font-extrabold leading-tight">{value}</p>
        {note ? <p className="meta mt-1.5">{note}</p> : null}
      </div>
    </li>
  )
}

/** Cabins with up to 4 bedrooms: a card with a photo for each room. */
function RoomCards({ rooms, cabin }: { rooms: Room[]; cabin: string }) {
  return (
    <ul className={`shadow-rotate mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 ${rooms.length === 2 ? 'max-w-3xl' : rooms.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
      {rooms.map((r, i) => (
        <li key={r.name} className="card flex flex-col overflow-hidden" data-reveal style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}>
          <div className="card-photo">
            <Photo src={r.image} alt={r.alt || `${r.name} at ${cabin}`} label={r.name} ratio="4 / 3" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" tint={(['mustard', 'sage', 'terracotta'] as const)[i % 3]} />
          </div>
          <div className="p-5">
            <p className="eyebrow">
              {r.floor ? `${r.floor} · ` : ''}Sleeps {r.sleeps}
            </p>
            <h3 className="h-small mt-1.5">{r.name}</h3>
            <p className="mt-1.5 font-bold">{r.beds}</p>
            {r.note ? <p className="meta mt-1">{r.note}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Bigger cabins: a compact sleeping plan grouped by floor, so 11 bedrooms fit in a few short rows. */
function SleepingPlan({ rooms }: { rooms: Room[] }) {
  const floors: { name: string; rooms: Room[] }[] = []
  for (const r of rooms) {
    const f = floors.find((x) => x.name === r.floor)
    if (f) f.rooms.push(r)
    else floors.push({ name: r.floor, rooms: [r] })
  }
  return (
    <div className="mt-8 grid gap-8">
      {floors.map((f) => (
        <div key={f.name} data-reveal>
          {f.name ? (
            <h3 className="eyebrow flex items-center gap-2.5">
              <Sparkle className="h-3.5 w-3.5" /> {f.name}
            </h3>
          ) : null}
          <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {f.rooms.map((r) => (
              <li key={r.name} className="rounded-2xl border-2 border-forest bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <Icon name="bed" className="h-6 w-6" />
                  <span className="chip chip-mustard !px-2.5 !py-1 !text-xs">Sleeps {r.sleeps}</span>
                </div>
                <p className="mt-3 font-extrabold leading-tight">{r.name}</p>
                <p className="mt-1 text-[0.9375rem] font-semibold">{r.beds}</p>
                {r.note ? <p className="meta mt-1">{r.note}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex text-terracotta-deep" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className="h-5 w-5" fill={value >= n - 0.25 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z" />
        </svg>
      ))}
    </span>
  )
}

/** Comments only at launch. Stars show when "Show star ratings" is on in Site settings. */
export function ReviewCard({ review: r, cabin, stars }: { review: Review; cabin: string; stars: boolean }) {
  return (
    <figure className="card flex h-full flex-col p-6">
      {stars && r.rating ? <Stars value={r.rating} /> : <Sparkle className="h-6 w-6 text-mustard" />}
      <blockquote className="mt-3 flex-1 text-lg font-medium leading-snug">“{r.quote}”</blockquote>
      <figcaption className="meta mt-4 font-extrabold">{[r.firstName, cabin, r.stayed].filter(Boolean).join(' · ')}</figcaption>
    </figure>
  )
}
