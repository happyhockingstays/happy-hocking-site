import { CabinRow } from '@/components/CabinRow'
import { OwnerForm } from '@/components/ContactForms'
import { FaqList } from '@/components/Faq'
import { Icon, Sparkle } from '@/components/Icon'
import { Photo } from '@/components/Photo'
import { SiteLink } from '@/components/SiteLink'
import { cabins, pages, settings, telHref } from '@/lib/content'

/**
 * Co-hosting page for homeowners. Words and photos come from content/pages/co-hosting.yml
 * (Pages CMS: Pages > Co-hosting). The owner form is separate from the guest contact form.
 */
export function CoHostingPage() {
  const p = pages.cohosting
  const stats: [string, string][] = [
    [settings.proof.rating, 'Airbnb rating at every home we host'],
    [settings.proof.reviewCount, 'Airbnb reviews across those homes'],
    ...(p.proof.replyTime ? [[p.proof.replyTime, 'How fast we typically reply to guests'] as [string, string]] : []),
  ]
  return (
    <>
      {/* Hero over a real cabin photo */}
      <section className="on-forest relative -mt-[var(--header-h)] flex min-h-[78svh] items-end overflow-hidden bg-forest text-cream">
        <Photo src={p.hero.image} alt={p.hero.alt} className="absolute inset-0 h-full w-full" priority sizes="100vw" emptyText="Photo: a home we host" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/55 to-forest/55" aria-hidden="true" />
        <div className="container-x relative z-10 pb-12 pt-[calc(var(--header-h)+3rem)] md:pb-16">
          <p className="eyebrow">{p.hero.eyebrow}</p>
          <h1 className="h-display mt-4 max-w-3xl">
            Happy homes start with <span className="accent">great hosts</span>
          </h1>
          {p.hero.lead ? <p className="lead mt-5 max-w-2xl">{p.hero.lead}</p> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#get-in-touch" className="btn btn-cohost btn-lg">
              Get in touch
            </a>
            <a href="#what-we-handle" className="btn btn-light btn-lg">
              See what we do
            </a>
          </div>
        </div>
      </section>

      {/* 3 things we do really well */}
      {p.threeThings.items.length ? (
        <section className="section sec-cream">
          <div className="container-x">
            <h2 className="h-section max-w-2xl" data-reveal>
              {p.threeThings.heading}
            </h2>
            <ol className="shadow-rotate mt-10 grid gap-7 md:grid-cols-3">
              {p.threeThings.items.map((t, i) => (
                <li key={t.title} className="card p-6 md:p-7" data-reveal>
                  <span className="font-display text-5xl leading-none text-terracotta-deep" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="h-card mt-4">{t.title}</h3>
                  <p className="mt-3">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* What we handle */}
      <section id="what-we-handle" className="section sec-sage-tint on-tint sec-line scroll-mt-24">
        <div className="container-x">
          <div className="max-w-2xl" data-reveal>
            {p.services.eyebrow ? <p className="eyebrow">{p.services.eyebrow}</p> : null}
            <h2 className="h-section mt-2">{p.services.heading}</h2>
            {p.services.intro ? <p className="lead mt-4">{p.services.intro}</p> : null}
          </div>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {p.services.items.map((s) => (
              <li key={s.title} className="flex gap-4" data-reveal>
                <span className="icon-tile">
                  <Icon name={s.icon} />
                </span>
                <div>
                  <h3 className="font-sans text-lg font-extrabold leading-snug">{s.title}</h3>
                  <p className="mt-1.5">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* It stays your home */}
      {p.ownership.points.length ? (
        <section className="section sec-forest on-forest">
          <div className="container-x">
            <h2 className="h-section" data-reveal>
              {p.ownership.heading}
            </h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
              {p.ownership.points.map((o) => (
                <li key={o.title} className="border-t-2 border-mustard pt-5" data-reveal>
                  <h3 className="flex items-start gap-2.5 font-sans text-xl font-extrabold leading-snug">
                    <Sparkle className="mt-1.5 h-4 w-4 shrink-0 text-mustard" /> {o.title}
                  </h3>
                  <p className="soft mt-2">{o.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Proof: the ratings, and the homes themselves */}
      <section className="section sec-cream overflow-hidden">
        <div className="container-x">
          <div className="max-w-2xl" data-reveal>
            {p.proof.eyebrow ? <p className="eyebrow">{p.proof.eyebrow}</p> : null}
            <h2 className="h-section mt-2">{p.proof.heading}</h2>
            {p.proof.intro ? <p className="lead mt-4">{p.proof.intro}</p> : null}
          </div>
          <dl className="shadow-rotate mt-8 grid gap-6 sm:grid-cols-3">
            {stats.map(([big, label]) => (
              <div key={label} className="card flex flex-col-reverse p-6" data-reveal>
                <dt className="mt-1 font-bold">{label}</dt>
                <dd className="font-display text-[2.5rem] leading-none text-terracotta-deep">{big}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12" data-reveal>
            <CabinRow cabins={cabins} />
          </div>
        </div>
      </section>

      {/* How we get started */}
      {p.steps.items.length ? (
        <section className="section sec-mustard-tint on-tint sec-line">
          <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5" data-reveal>
              {p.steps.eyebrow ? <p className="eyebrow">{p.steps.eyebrow}</p> : null}
              <h2 className="h-section mt-2">{p.steps.heading}</h2>
              {p.steps.intro ? <p className="lead mt-4">{p.steps.intro}</p> : null}
            </div>
            <ol className="grid gap-5 lg:col-span-7">
              {p.steps.items.map((s, i) => (
                <li key={s.title} className="card shadow-forest flex gap-5 p-5 md:p-6" data-reveal>
                  <span className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-forest bg-mustard text-2xl leading-none" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="h-small font-display">{s.title}</h3>
                    <p className="mt-1.5">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* Owner testimonials. Hidden until the first one is added in Pages CMS. */}
      {p.testimonials.length ? (
        <section className="section sec-cream sec-line">
          <div className="container-x">
            <h2 className="h-section" data-reveal>
              Happy owners, happy homes
            </h2>
            <ul className="shadow-rotate mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {p.testimonials.map((t) => (
                <li key={t.quote} data-reveal>
                  <figure className="card flex h-full flex-col p-6">
                    <Sparkle className="h-6 w-6 text-mustard" />
                    <blockquote className="mt-3 flex-1 text-lg font-medium leading-snug">“{t.quote}”</blockquote>
                    <figcaption className="meta mt-4 font-extrabold">{[t.name, t.home].filter(Boolean).join(' · ')}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Owner form */}
      <section id="get-in-touch" className="section sec-forest on-forest scroll-mt-20">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5" data-reveal>
            <p className="eyebrow">{p.form.eyebrow}</p>
            <h2 className="h-section mt-2">{p.form.heading}</h2>
            {p.form.text ? <p className="lead soft mt-4">{p.form.text}</p> : null}
            <ul className="mt-7 grid gap-3 font-bold">
              {settings.phone ? (
                <li>
                  <a href={telHref(settings.phone)} className="inline-flex items-center gap-3 hover:text-mustard">
                    <Icon name="phone" /> {settings.phone}
                  </a>
                </li>
              ) : null}
              {settings.email ? (
                <li>
                  <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-3 [overflow-wrap:anywhere] hover:text-mustard">
                    <Icon name="mail" /> {settings.email}
                  </a>
                </li>
              ) : null}
            </ul>
            <p className="soft mt-7">
              Looking to book a stay instead?{' '}
              <SiteLink to="/cabins" className="text-link">
                See our cabins
              </SiteLink>
            </p>
          </div>
          <div className="lg:col-span-7" data-reveal>
            <div className="card p-6 md:p-8">
              <OwnerForm />
            </div>
          </div>
        </div>
      </section>

      {/* Owner FAQs */}
      {p.faqs.length ? (
        <section id="owner-faqs" className="section sec-cream scroll-mt-24">
          <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4" data-reveal>
              <p className="eyebrow">Owner FAQs</p>
              <h2 className="h-section mt-2">Good to know</h2>
            </div>
            <div className="lg:col-span-8" data-reveal>
              <FaqList items={p.faqs} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
