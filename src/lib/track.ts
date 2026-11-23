// Site events for Google Tag Manager. The site only pushes events into window.dataLayer.
// GTM (loaded in src/routes/__root.tsx on the live site only) passes them on to GA4.
// The full list of events and their parameters is in docs/tracking/README.md. Keep the two in step.
//
// No personal details ever go into the dataLayer: no names, emails, phone numbers, dates or messages.

type Params = Record<string, string | number | boolean | undefined>

// Every parameter any site event uses. Each push resets the others, so a value from one event
// never carries over into the next one in GTM's data model.
const KEYS = ['form_name', 'lead_type', 'cabin'] as const

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function track(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  const blank = Object.fromEntries(KEYS.map((k) => [k, undefined]))
  window.dataLayer.push({ event, ...blank, ...params })
}

// The forms GA4 reports on, by their Netlify form name (or data-form on the Mailchimp signup).
// The private review form is left out on purpose: it isn't a lead.
const FORM_NAMES: Record<string, string> = {
  contact: 'contact',
  'owner-inquiry': 'owner_inquiry',
  'insider-list': 'insider_list',
}

export function formNameOf(form: HTMLFormElement | null) {
  if (!form) return undefined
  return FORM_NAMES[form.getAttribute('data-form') || form.getAttribute('name') || '']
}

let started = false

// form_start: the first time someone types in or picks something in a tracked form, once per form per page.
// Listens on the document, so it covers every form on every page without touching the form code.
export function startTracking() {
  if (started || typeof document === 'undefined') return
  started = true
  const seen = new WeakSet<HTMLFormElement>()
  const onStart = (event: Event) => {
    const form = (event.target as Element | null)?.closest?.('form') as HTMLFormElement | null
    const name = formNameOf(form)
    if (!form || !name || seen.has(form)) return
    seen.add(form)
    track('form_start', { form_name: name })
  }
  document.addEventListener('input', onStart, { capture: true })
  document.addEventListener('change', onStart, { capture: true })
}
