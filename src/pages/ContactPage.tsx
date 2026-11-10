import { useEffect, useState } from 'react'
import { BookLink } from '@/components/Header'
import { OwnerForm, StayForm } from '@/components/ContactForms'
import { Icon } from '@/components/Icon'
import { settings, telHref } from '@/lib/content'

type Topic = 'stay' | 'co-hosting'

/**
 * Contact, with a topic picker so guest and owner messages stay apart: each topic has its own
 * form, and each form can email a different person. /contact?topic=co-hosting opens on the owner form.
 */
export function ContactPage() {
  const [topic, setTopic] = useState<Topic>('stay')
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('topic') === 'co-hosting') setTopic('co-hosting')
  }, [])
  const topics: { key: Topic; icon: string; label: string; note: string }[] = [
    { key: 'stay', icon: 'calendar', label: 'A stay', note: 'Booking, cabins and trip questions' },
    { key: 'co-hosting', icon: 'check-in', label: 'Co-hosting', note: 'Hosting help for your vacation home' },
  ]
  return (
    <>
      <section className="sec-terracotta-tint on-tint border-b-2 border-forest py-12 md:py-16">
        <div className="container-x">
          <p className="eyebrow">Contact</p>
          <h1 className="h-display mt-3">Happy to help</h1>
          <p className="lead mt-4 max-w-2xl">Pick a topic and your note goes straight to the right person. We typically reply within an hour.</p>
        </div>
      </section>

      <section className="section sec-cream">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <fieldset>
              <legend className="label !mb-3">What can we help with?</legend>
              <div className="shadow-rotate grid gap-4 sm:grid-cols-2">
                {topics.map((t) => (
                  <label key={t.key} className={`card card-link flex cursor-pointer items-center gap-4 p-4 ${topic === t.key ? '!bg-mustard-tint' : ''}`}>
                    <input type="radio" name="topic" value={t.key} checked={topic === t.key} onChange={() => setTopic(t.key)} className="sr-only" />
                    <span className="icon-tile !shadow-none">
                      <Icon name={t.icon} />
                    </span>
                    <span>
                      <span className="block text-lg font-extrabold leading-tight">{t.label}</span>
                      <span className="meta block">{t.note}</span>
                    </span>
                    {topic === t.key ? <Icon name="check" className="ml-auto h-6 w-6 shrink-0" /> : null}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="card shadow-mustard mt-8 p-6 md:p-8">
              <h2 className="h-card mb-6">{topic === 'stay' ? 'Ask about a stay' : 'Tell us about your home'}</h2>
              {topic === 'stay' ? <StayForm key="stay" /> : <OwnerForm key="owner" />}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="card shadow-sage p-6 md:p-7">
              <h2 className="h-card">Reach us directly</h2>
              <ul className="mt-5 grid gap-4 font-bold">
                {settings.phone ? (
                  <li>
                    <a href={telHref(settings.phone)} className="inline-flex items-center gap-3 hover:text-terracotta-deep">
                      <span className="icon-tile !shadow-none">
                        <Icon name="phone" />
                      </span>
                      {settings.phone}
                    </a>
                  </li>
                ) : null}
                {settings.email ? (
                  <li>
                    <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-3 [overflow-wrap:anywhere] hover:text-terracotta-deep">
                      <span className="icon-tile !shadow-none">
                        <Icon name="mail" />
                      </span>
                      {settings.email}
                    </a>
                  </li>
                ) : null}
                {settings.instagram ? (
                  <li>
                    <a href={`https://www.instagram.com/${settings.instagram}`} target="_blank" rel="noopener" className="inline-flex items-center gap-3 hover:text-terracotta-deep">
                      <span className="icon-tile !shadow-none">
                        <Icon name="instagram" />
                      </span>
                      @{settings.instagram}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
            <div className="mt-8 rounded-[18px] border-2 border-forest bg-sage-tint p-6 md:p-7">
              <h2 className="h-small font-display">Ready to book?</h2>
              <p className="mt-2">Check dates and book any cabin direct. No need to message first.</p>
              <BookLink className="btn btn-book mt-5">Check availability</BookLink>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
