import { useEffect, useState } from 'react'
import { Field, FormError, Sent } from '@/components/ContactForms'
import { Honeypot, useNetlifyForm } from '@/components/Forms'
import { cabinBySlug, cabins } from '@/lib/content'

/**
 * Private review form at /review. Not linked in the navigation, kept out of search results
 * and out of the sitemap. Guests reach it from the post-checkout message, where the link
 * carries their cabin: /review?cabin=pickle-hill.
 *
 * Submissions go to Netlify Forms and are emailed to the hosts. Nothing is published from here:
 * a host adds an approved review by hand in Pages CMS (Reviews). The private feedback field
 * stays in that email and never goes into the site.
 */
const CATEGORIES: [string, string][] = [
  ['cleanliness', 'Cleanliness'],
  ['accuracy', 'Accuracy'],
  ['check-in', 'Check-in'],
  ['communication', 'Communication'],
  ['location', 'Location'],
  ['value', 'Value'],
]

/** The last 18 months, newest first: "October 2026". */
function recentMonths() {
  const out: string[] = []
  const d = new Date()
  d.setDate(1)
  for (let i = 0; i < 18; i++) {
    out.push(d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
    d.setMonth(d.getMonth() - 1)
  }
  return out
}

/** 1 to 5 stars as radio buttons: works with a keyboard, a screen reader and without JavaScript. */
function StarInput({ name, label, required, large }: { name: string; label: string; required?: boolean; large?: boolean }) {
  const [value, setValue] = useState(0)
  const [hover, setHover] = useState(0)
  const shown = hover || value
  const size = large ? 'h-10 w-10 sm:h-11 sm:w-11' : 'h-7 w-7 sm:h-8 sm:w-8'
  const id = `stars-${name}`
  return (
    <div role="radiogroup" aria-labelledby={id} className={large ? '' : 'flex items-center justify-between gap-3 border-t-2 border-forest/15 py-2.5'}>
      <span id={id} className={large ? 'label !mb-2' : 'min-w-0 text-[0.9375rem] font-bold sm:text-base'}>
        {label}
      </span>
      <div className="flex shrink-0" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer p-0.5" onMouseEnter={() => setHover(n)}>
            <input type="radio" name={name} value={n} required={required} checked={value === n} onChange={() => setValue(n)} className="peer sr-only" />
            <svg viewBox="0 0 24 24" className={`${size} rounded text-terracotta-deep peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-mustard`} fill={shown >= n ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z" />
            </svg>
            <span className="sr-only">
              {n} {n === 1 ? 'star' : 'stars'}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function ReviewPage() {
  const { state, onSubmit } = useNetlifyForm()
  const [cabin, setCabin] = useState('')
  const [months, setMonths] = useState<string[]>([])
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('cabin') || ''
    const match = cabinBySlug(slug)
    if (match) setCabin(match.name)
    setMonths(recentMonths())
  }, [])

  return (
    <>
      <section className="sec-mustard-tint on-tint border-b-2 border-forest py-12 md:py-16">
        <div className="container-x max-w-3xl">
          <p className="eyebrow">Thanks for staying with us</p>
          <h1 className="h-display mt-3">How was your stay?</h1>
          <p className="lead mt-4">It takes about 2 minutes, and your words help the next guest pick their cabin.</p>
        </div>
      </section>

      <section className="section sec-cream">
        <div className="container-x max-w-3xl">
          <div className="card shadow-mustard p-5 md:p-9">
            {state === 'sent' ? (
              <Sent title="Thank you. That made our day" text="Your review is on its way to us. We read every one." />
            ) : (
              <form name="review" method="POST" onSubmit={onSubmit} className="grid min-w-0 gap-7 [&>*]:min-w-0">
                <input type="hidden" name="form-name" value="review" />
                <input type="hidden" name="subject" value="New guest review from happyhocking.com" />
                <Honeypot />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Which cabin?" name="cabin" required>
                    <select id="f-cabin" name="cabin" required className="field" value={cabin} onChange={(e) => setCabin(e.target.value)}>
                      <option value="" disabled>
                        Pick your cabin
                      </option>
                      {cabins.map((c) => (
                        <option key={c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="When did you stay?" name="stayed" required>
                    <select id="f-stayed" name="stayed" required className="field" defaultValue="">
                      <option value="" disabled>
                        Pick a month
                      </option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <StarInput name="rating" label="Overall rating" required large />

                <div>
                  <p className="label !mb-1">Rate the details</p>
                  <div className="border-b-2 border-forest/15">
                    {CATEGORIES.map(([name, label]) => (
                      <StarInput key={name} name={name} label={label} />
                    ))}
                  </div>
                </div>

                <Field label="Your review" name="comment" required hint="We may share this on our site with your first name, your cabin and the month you stayed.">
                  <textarea id="f-comment" name="comment" required className="field" rows={5} placeholder="What did you love?" />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name" name="first-name" required autoComplete="given-name" />
                  <Field label="Email" name="email" type="email" required autoComplete="email" hint="Never shown. Only so we can reply." />
                </div>

                <Field label="Private note for the hosts" name="private-feedback" hint="Anything we could do better? This stays between us and is never published.">
                  <textarea id="f-private-feedback" name="private-feedback" className="field" rows={4} />
                </Field>

                {state === 'error' ? <FormError /> : null}
                <div>
                  <button type="submit" className="btn btn-book btn-lg" disabled={state === 'sending'}>
                    {state === 'sending' ? 'Sending…' : 'Send my review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
