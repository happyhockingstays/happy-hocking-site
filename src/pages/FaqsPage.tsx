import { ClosingBand } from '@/components/ClosingBand'
import { FaqList } from '@/components/Faq'
import { Icon } from '@/components/Icon'
import { SiteLink } from '@/components/SiteLink'
import { pages, settings, telHref } from '@/lib/content'

export const faqId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Guest FAQs, grouped. Questions and answers come from content/pages/faqs.yml (Pages CMS: Pages > FAQs). */
export function FaqsPage() {
  const p = pages.faqs
  return (
    <>
      <section className="sec-mustard-tint on-tint border-b-2 border-forest py-12 md:py-16">
        <div className="container-x">
          <p className="eyebrow">Hocking Hills cabin FAQs</p>
          <h1 className="h-display mt-3">Happy to help</h1>
          {p.intro ? <p className="lead mt-4 max-w-2xl">{p.intro}</p> : null}
          <ul className="mt-7 flex flex-wrap gap-2">
            {p.groups.map((g) => (
              <li key={g.title}>
                <a href={`#${faqId(g.title)}`} className="chip !px-4 !py-2.5 !text-sm hover:bg-card">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section sec-cream">
        <div className="container-x grid gap-12">
          {p.groups.map((g) => (
            <div key={g.title} id={faqId(g.title)} className="grid scroll-mt-28 gap-6 lg:grid-cols-12 lg:gap-14" data-reveal>
              <h2 className="h-section !text-[clamp(1.625rem,3vw,2.25rem)] lg:col-span-4">{g.title}</h2>
              <div className="lg:col-span-8">
                <FaqList items={g.items} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section sec-forest on-forest">
        <div className="container-x flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div data-reveal>
            <h2 className="h-section">Still have a question?</h2>
            <p className="lead soft mt-3 max-w-xl">Send us a note or give us a call. A real person answers, typically within an hour.</p>
            <p className="soft mt-4">
              Looking for a co-host?{' '}
              <SiteLink to="/co-hosting" hash="owner-faqs" className="text-link">
                Read the owner FAQs
              </SiteLink>
            </p>
          </div>
          <div className="flex flex-wrap gap-3" data-reveal>
            <SiteLink to="/contact" className="btn btn-mustard btn-lg">
              <Icon name="mail" className="h-5 w-5" /> Contact us
            </SiteLink>
            {settings.phone ? (
              <a href={telHref(settings.phone)} className="btn btn-light btn-lg">
                <Icon name="phone" className="h-5 w-5" /> {settings.phone}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <ClosingBand />
    </>
  )
}
