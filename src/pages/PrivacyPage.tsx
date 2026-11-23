import { useEffect, useState } from 'react'
import { SiteLink } from '@/components/SiteLink'
import { formatDate, pages, settings, telHref } from '@/lib/content'

// The advertising cookie switch (#choices). It sets hh_ads_optout=1 for a year, which the consent defaults in
// src/routes/__root.tsx read before Google Tag Manager loads. Visit statistics stay on either way.
// Change this page before adding any non-Google tag (Meta, Microsoft) to GTM. See docs/tracking/README.md.
const COOKIE = 'hh_ads_optout'
const optedOut = () => new RegExp(`(?:^|;\\s*)${COOKIE}=1`).test(document.cookie)

function writeCookie(off: boolean) {
  const domain = /(^|\.)happyhocking\.com$/.test(location.hostname) ? '; domain=.happyhocking.com' : ''
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${off ? '1' : ''}; max-age=${off ? 31536000 : 0}; path=/${domain}; SameSite=Lax${secure}`
}

function updateConsent(allowed: boolean) {
  const state = allowed ? 'granted' : 'denied'
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
  w.dataLayer = w.dataLayer || []
  if (typeof w.gtag === 'function') w.gtag('consent', 'update', { ad_storage: state, ad_user_data: state, ad_personalization: state })
  w.dataLayer.push({ event: 'privacy_choice_update', ads_allowed: allowed })
}

function AdChoices() {
  // null until the browser has been read, so the switch never shows the wrong state
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [gpc, setGpc] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    const signal = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true
    setGpc(signal)
    setAllowed(signal ? false : !optedOut())
  }, [])
  const flip = () => {
    if (allowed === null || gpc) return
    const next = !allowed
    writeCookie(!next)
    updateConsent(next)
    setAllowed(next)
    setSaved(true)
  }
  return (
    <section>
      <h2 id="choices">Your privacy choices</h2>
      <p>
        Visit statistics stay on, because they show us which pages help guests plan a stay. Advertising cookies can be
        turned off here. If we run Google ads, they let Google measure which ads bring people to the site and show our
        ads to past visitors. Turning them off also opts you out of the sale or sharing of personal information for
        cross-context behavioral advertising.
      </p>
      <div className="card shadow-sage mt-6 grid gap-3 p-5 md:p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-extrabold" id="ads-label">
              Allow advertising cookies
            </p>
            <p className="meta mt-1" id="ads-desc">
              Ad measurement and showing our ads to past visitors
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={allowed === true}
            aria-labelledby="ads-label"
            aria-describedby="ads-desc"
            disabled={allowed === null || gpc}
            onClick={flip}
            className={`relative mt-1 h-[30px] w-[52px] shrink-0 rounded-full border-2 border-forest transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              allowed ? 'bg-forest' : 'bg-soft-cream'
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-[2px] top-[2px] h-[22px] w-[22px] rounded-full border-2 border-forest bg-card transition-transform duration-200 ${
                allowed ? 'translate-x-[22px]' : ''
              }`}
            />
          </button>
        </div>
        {gpc ? (
          <p className="meta">
            Your browser is sending a Global Privacy Control signal, so advertising cookies are already off on this browser
            for as long as that signal is on.
          </p>
        ) : null}
        <p className="meta" aria-live="polite">
          {allowed === null ? '' : `${saved ? 'Saved. ' : ''}Advertising cookies are ${allowed ? 'on' : 'off'} for this browser.`}
        </p>
        <p className="meta">Your choice is saved on this browser and device. Set it again on another browser or after clearing cookies.</p>
      </div>
    </section>
  )
}

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
            <AdChoices />
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
