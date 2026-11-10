import { SearchWidget } from '@/components/Booking'
import { CabinRow } from '@/components/CabinRow'
import { ClosingBand } from '@/components/ClosingBand'
import { Drift } from '@/components/Drift'
import { FaqList } from '@/components/Faq'
import { Icon, Sparkle, type IconName } from '@/components/Icon'
import { Photo } from '@/components/Photo'
import { ReviewCarousel } from '@/components/Reviews'
import { SiteLink } from '@/components/SiteLink'
import { asset } from '@/lib/asset'
import { cabins, homeFaqs, pages, reviews, settings } from '@/lib/content'

/**
 * Homepage, in the brand guide's order: hero with the date search, proof strip, cabin row,
 * story band, reviews, co-hosting band, Hocking Hills photo band, FAQs and the closing band.
 * The words and photos come from content/pages/home.yml (Pages CMS: Pages > Homepage).
 */
export function HomePage() {
  const p = pages.home
  const proof: [IconName, string][] = [
    ['star', `Every cabin rated ${settings.proof.rating} on Airbnb`],
    ['hot-tub', 'A private pool and hot tub at every cabin'],
    ['check', 'Book direct and skip the booking-site fees'],
  ]
  return (
    <>
      {/* 1. Hero: full-bleed photo (or video, once the clients send a clip) with the date and guest search */}
      <section className="on-forest relative -mt-[var(--header-h)] flex min-h-[92svh] items-center overflow-hidden bg-forest text-cream">
        <Photo src={p.hero.image} alt={p.hero.alt} className="absolute inset-0 h-full w-full" priority sizes="100vw" emptyText="Hero photo or video" />
        {p.hero.video ? (
          <video className="hero-video absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={asset(p.hero.image)} aria-hidden="true">
            {p.hero.videoPhone ? <source src={asset(p.hero.videoPhone)} media="(max-width: 767px)" /> : null}
            <source src={asset(p.hero.video)} />
          </video>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/75 via-forest/40 to-forest/80" aria-hidden="true" />
        <div className="container-x relative z-10 pb-14 pt-[calc(var(--header-h)+2rem)] text-center md:pb-20">
          {p.hero.eyebrow ? <p className="eyebrow">{p.hero.eyebrow}</p> : null}
          <h1 className="h-display mx-auto mt-4 max-w-4xl">
            A place for <span className="accent">everyone</span> in the Hocking Hills
          </h1>
          {p.hero.lead ? <p className="lead mx-auto mt-5 max-w-2xl">{p.hero.lead}</p> : null}
          <div className="card mx-auto mt-9 max-w-3xl p-4 text-left md:p-5">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* 2. Proof strip */}
      <section className="sec-mustard sec-lines py-5">
        <ul className="container-x flex flex-col items-start gap-3 font-extrabold md:flex-row md:items-center md:justify-between">
          {proof.map(([icon, text]) => (
            <li key={text} className="flex items-center gap-2.5">
              <Icon name={icon} /> {text}
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Cabins in a row that scrolls sideways */}
      <section className="section sec-cream overflow-hidden">
        <div className="container-x">
          <div className="max-w-2xl" data-reveal>
            <p className="eyebrow">{p.cabins.eyebrow}</p>
            <h2 className="h-section mt-2">
              Find your happy place <Sparkle className="ml-1 inline-block h-[0.6em] w-[0.6em] align-baseline text-mustard" />
            </h2>
            {p.cabins.intro ? <p className="lead mt-4">{p.cabins.intro}</p> : null}
          </div>
          <div className="mt-8" data-reveal>
            <CabinRow cabins={cabins} />
          </div>
          <p className="mt-8">
            <SiteLink to="/cabins" className="btn btn-book btn-lg">
              See all cabins
            </SiteLink>
          </p>
        </div>
      </section>

      {/* 4. Short story band */}
      {p.story.text ? (
        <section className="section sec-sage-tint on-tint sec-line">
          <div className="container-x grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className="frame shadow-terracotta" data-reveal>
              <Photo src={p.story.image} alt={p.story.alt} ratio="4 / 3" sizes="(min-width: 768px) 50vw, 100vw" label="The team or a cabin moment" />
            </div>
            <div data-reveal>
              {p.story.eyebrow ? <p className="eyebrow">{p.story.eyebrow}</p> : null}
              <h2 className="h-section mt-2">{p.story.heading}</h2>
              <p className="lead mt-5 max-w-xl">{p.story.text}</p>
              {p.story.linkLabel ? (
                <p className="mt-6">
                  <SiteLink to="/about" className="btn btn-forest">
                    {p.story.linkLabel}
                  </SiteLink>
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* 5. Reviews. Hidden until the first review is published, so nothing looks empty. */}
      {reviews.length ? (
        <section className="section sec-cream sec-line overflow-hidden">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
              <div className="max-w-2xl">
                <p className="eyebrow">Guest reviews</p>
                <h2 className="h-section mt-2">Happy guests, happy homes</h2>
                {p.reviews.intro ? <p className="lead mt-4">{p.reviews.intro}</p> : null}
              </div>
              <p className="chip chip-mustard !px-4 !py-2.5 !text-sm">
                <Icon name="star" /> Every cabin rated {settings.proof.rating} on Airbnb · {settings.proof.reviewCount} reviews
              </p>
            </div>
            <div className="mt-8" data-reveal>
              <ReviewCarousel reviews={reviews.slice(0, 10)} />
            </div>
          </div>
        </section>
      ) : null}

      {/* 6. Co-hosting band */}
      <section className="section sec-forest on-forest">
        <div className="container-x grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div data-reveal>
            {p.cohost.eyebrow ? <p className="eyebrow">{p.cohost.eyebrow}</p> : null}
            <h2 className="h-section mt-2">{p.cohost.heading}</h2>
            {p.cohost.text ? <p className="lead soft mt-5 max-w-xl">{p.cohost.text}</p> : null}
            {p.cohost.points.length ? (
              <ul className="sparkle-list mt-6 font-bold">
                {p.cohost.points.map((x) => (
                  <li key={x}>
                    <Sparkle /> {x}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-8">
              <SiteLink to="/co-hosting" className="btn btn-cohost btn-lg">
                Co-host with us
              </SiteLink>
            </p>
          </div>
          <div className="frame" data-reveal>
            <Photo src={p.cohost.image} alt={p.cohost.alt} ratio="4 / 3" sizes="(min-width: 768px) 50vw, 100vw" label="A home we host" tint="mustard" />
          </div>
        </div>
      </section>

      {/* 7. Full-bleed Hocking Hills photo band, linking to the area guides on the blog */}
      {p.area.heading ? (
        <section className="on-forest relative flex min-h-[70svh] items-end overflow-hidden bg-forest text-cream">
          <Drift>
            <Photo src={p.area.image} alt={p.area.alt} className="h-full w-full" sizes="100vw" emptyText="Photo: the Hocking Hills" />
          </Drift>
          <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" aria-hidden="true" />
          <div className="container-x relative z-10 py-12 md:py-16" data-reveal>
            {p.area.eyebrow ? <p className="eyebrow">{p.area.eyebrow}</p> : null}
            <h2 className="h-section mt-2 max-w-2xl">{p.area.heading}</h2>
            {p.area.text ? <p className="lead mt-4 max-w-2xl">{p.area.text}</p> : null}
            {p.area.linkLabel ? (
              <p className="mt-7">
                <SiteLink to="/blog" className="btn btn-mustard">
                  {p.area.linkLabel} <Icon name="arrow-right" className="h-5 w-5" />
                </SiteLink>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 8. FAQs */}
      {homeFaqs.length ? (
        <section className="section sec-cream">
          <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4" data-reveal>
              <p className="eyebrow">{p.faqs.eyebrow}</p>
              <h2 className="h-section mt-2">{p.faqs.heading}</h2>
              <p className="mt-6">
                <SiteLink to="/faqs" className="text-link">
                  See all FAQs
                </SiteLink>
              </p>
            </div>
            <div className="lg:col-span-8" data-reveal>
              <FaqList items={homeFaqs} />
            </div>
          </div>
        </section>
      ) : null}

      {/* 9. Closing booking band */}
      <ClosingBand heading={p.closing.heading} text={p.closing.text} />
    </>
  )
}
