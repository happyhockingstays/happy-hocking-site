import { useState, type FormEvent } from 'react'
import { settings } from '@/lib/content'
import { Icon } from './Icon'

/**
 * Netlify Forms. The matching static form definitions live in /public/__forms.html so
 * Netlify detects them at deploy time; the live forms post to that static file.
 * Every submission is emailed to the hosts once a notification is set in Netlify > Forms.
 */
async function submitNetlify(form: HTMLFormElement) {
  const data = new FormData(form)
  const body = new URLSearchParams(data as unknown as Record<string, string>).toString()
  const res = await fetch('/__forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`Form error ${res.status}`)
}

export function useNetlifyForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('sending')
    try {
      await submitNetlify(e.currentTarget)
      setState('sent')
    } catch {
      setState('error')
    }
  }
  return { state, onSubmit }
}

/** Hidden field that real visitors never fill in. Netlify drops submissions that do. */
export function Honeypot() {
  return (
    <p className="hidden">
      <label>
        Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" />
      </label>
    </p>
  )
}

/**
 * Insider list signup (footer and blog posts).
 * With a Mailchimp form address in Site settings, it posts straight to Mailchimp in a new tab.
 * Until then it saves signups to Netlify Forms ("insider-list") so none are lost.
 */
export function InsiderSignup({ id = 'insider' }: { id?: string }) {
  const { state, onSubmit } = useNetlifyForm()
  const mailchimp = settings.mailchimpAction
  if (state === 'sent')
    return (
      <p className="flex items-center gap-3 text-lg font-bold" role="status">
        <span className="icon-tile">
          <Icon name="check" />
        </span>
        You're on the list. Watch your inbox.
      </p>
    )
  const fields = (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="min-w-0 flex-1">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input id={`${id}-email`} name={mailchimp ? 'EMAIL' : 'email'} type="email" required autoComplete="email" placeholder="Your email" className="field !min-h-[48px] !rounded-full !bg-card !px-5" />
      </div>
      <button type="submit" className="btn btn-mustard" disabled={state === 'sending'}>
        {state === 'sending' ? 'Joining…' : 'Join the insider list'}
      </button>
    </div>
  )
  if (mailchimp)
    return (
      <form action={mailchimp} method="post" target="_blank" rel="noopener">
        {fields}
      </form>
    )
  return (
    <form name="insider-list" method="POST" onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value="insider-list" />
      <Honeypot />
      {fields}
      {state === 'error' ? (
        <p className="mt-3 text-sm font-bold" role="alert">
          That didn't send. Please try again in a minute.
        </p>
      ) : null}
    </form>
  )
}
