import type { ReactNode } from 'react'
import { cabins } from '@/lib/content'
import { Honeypot, useNetlifyForm } from './Forms'
import { Icon } from './Icon'

/**
 * The guest contact form and the owner (co-hosting) form. They are two separate Netlify forms,
 * so guest questions and owner inquiries never mix and each can email a different person.
 * Field names here must match the hidden copies in /public/__forms.html.
 */
export function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  placeholder,
  hint,
  children,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
  hint?: string
  /** Pass a <select> or <textarea> to use instead of a plain input. */
  children?: ReactNode
}) {
  const id = `f-${name}`
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required ? null : <span className="ml-1.5 font-semibold normal-case tracking-normal opacity-70">optional</span>}
      </label>
      {children || <input id={id} name={name} type={type} required={required} autoComplete={autoComplete} placeholder={placeholder} className="field" />}
      {hint ? <p className="meta mt-1.5 opacity-80">{hint}</p> : null}
    </div>
  )
}

export function Sent({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex items-start gap-4 py-6" role="status">
      <span className="icon-tile shadow-mustard">
        <Icon name="check" />
      </span>
      <div>
        <p className="h-small font-display">{title}</p>
        <p className="mt-1.5">{text}</p>
      </div>
    </div>
  )
}

export function FormError() {
  return (
    <p className="font-bold text-terracotta-deep" role="alert">
      That didn't send. Please try again in a minute, or call or email us.
    </p>
  )
}

/** Guest questions about a stay. */
export function StayForm() {
  const { state, onSubmit } = useNetlifyForm()
  if (state === 'sent') return <Sent title="Got it. Thanks for reaching out" text="We typically reply within an hour." />
  return (
    <form name="contact" method="POST" onSubmit={onSubmit} className="grid gap-5">
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="subject" value="Guest question from happyhocking.com" />
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
        <Field label="Cabin" name="cabin">
          <select id="f-cabin" name="cabin" className="field" defaultValue="">
            <option value="">Not sure yet</option>
            {cabins.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Dates you have in mind" name="dates" placeholder="June 12 to 15" />
      <Field label="How can we help?" name="message" required>
        <textarea id="f-message" name="message" required className="field" rows={5} />
      </Field>
      {state === 'error' ? <FormError /> : null}
      <div>
        <button type="submit" className="btn btn-book btn-lg" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  )
}

/** Homeowners asking about co-hosting. Its own form, on the co-hosting page and behind the Contact topic picker. */
export function OwnerForm() {
  const { state, onSubmit } = useNetlifyForm()
  if (state === 'sent') return <Sent title="Got it. Talk soon" text="We'll be in touch to set up your intro call." />
  return (
    <form name="owner-inquiry" method="POST" onSubmit={onSubmit} className="grid gap-5">
      <input type="hidden" name="form-name" value="owner-inquiry" />
      <input type="hidden" name="subject" value="Co-hosting inquiry from happyhocking.com" />
      <Honeypot />
      <Field label="Name" name="name" required autoComplete="name" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <Field label="Where is your home?" name="location" required placeholder="Town or area" />
      <Field label="Tell us about it" name="message" hint="Bedrooms, amenities and whether it's renting now all help.">
        <textarea id="f-message" name="message" className="field" rows={5} />
      </Field>
      {state === 'error' ? <FormError /> : null}
      <div>
        <button type="submit" className="btn btn-book btn-lg" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send it our way'}
        </button>
      </div>
    </form>
  )
}
