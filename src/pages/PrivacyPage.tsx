import { SiteLink } from '@/components/SiteLink'
import { formatDate, pages, settings, telHref } from '@/lib/content'

/** Privacy policy. The words come from content/pages/privacy.yml (Pages CMS: Page: Privacy). */
export function PrivacyPage() {
  const p = pages.privacy
  return (
    <>
      <section className="sec-mustard-tint on-tint border-b-2 border-forest py-12 md:py-16">
        <div className="container-x">
          <p className="eyebrow">The fine print, in plain words</p>
          <h1 className="h-display mt-3">Privacy policy</h1>
          {p.updated ? <p className="meta mt-4">Last updated {formatDate(p.updated)}</p> : null}
        </div>
      </section>

      <section className="section sec-cream">
        <div className="container-x">
          <div className="post-body">
            {p.intro ? <p className="lead">{p.intro}</p> : null}
            {p.sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.text.split(/\n\s*\n/).map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </section>
            ))}
            <section>
              <h2>How to reach us</h2>
              <p>
                Questions about this page or your information? <SiteLink to="/contact">Send us a note</SiteLink>
                {settings.email ? (
                  <>
                    , email <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </>
                ) : null}
                {settings.phone ? (
                  <>
                    {' '}
                    or call <a href={telHref(settings.phone)}>{settings.phone}</a>
                  </>
                ) : null}
                .
              </p>
              <p>{settings.legalName}, Hocking Hills, Ohio</p>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
