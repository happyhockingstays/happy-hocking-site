import { useEffect, useRef } from 'react'
import { settings, telHref } from '@/lib/content'
import { Icon, Sparkle } from './Icon'

/**
 * Hospitable widgets.
 *
 * DO NOT EDIT THE WIDGET CODE. Hospitable supplies each embed snippet, and it is pasted
 * as is into Pages CMS (a cabin's "Booking widget code", or "Search widget code" in Site
 * settings). This component only injects that snippet into the page. We frame the widget
 * in our own card and never restyle what is inside it.
 */
export function HospitableEmbed({ code, minHeight = 420 }: { code: string; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = ref.current
    if (!host || !code.trim()) return
    host.innerHTML = ''
    const tpl = document.createElement('template')
    tpl.innerHTML = code
    host.appendChild(tpl.content)
    // Scripts parsed inside a <template> never run, so swap each for a fresh one (runs once).
    host.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script')
      for (const a of Array.from(old.attributes)) s.setAttribute(a.name, a.value)
      s.text = old.text
      old.replaceWith(s)
    })
  }, [code])
  return <div ref={ref} style={{ minHeight }} className="widget-host" />
}

/** Shown until the Hospitable code is pasted in. Never appears on a cabin that has its widget. */
function WidgetPlaceholder({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-forest bg-cream px-5 py-10 text-center">
      <p className="font-extrabold">{title}</p>
      <p className="meta mt-1">{text}</p>
    </div>
  )
}

/** The booking card on every cabin page: fixed in place and centered, not following the scroll. */
export function BookingCard({ cabin, code }: { cabin: string; code: string }) {
  return (
    <div id="book" className="card shadow-mustard mx-auto w-full max-w-xl scroll-mt-28 p-5 md:p-7">
      <p className="eyebrow text-center">Check availability</p>
      <div className="mt-4">
        {code.trim() ? (
          <HospitableEmbed code={code} />
        ) : (
          <WidgetPlaceholder title={`Hospitable booking widget for ${cabin}`} text="Dates, guests, price and Book now show here" />
        )}
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-center font-bold">
        <Sparkle className="h-4 w-4 shrink-0 text-terracotta-deep" />
        Book direct and skip the booking-site service fees
      </p>
      {settings.phone || settings.email ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t-2 border-forest pt-4 text-[0.9375rem]">
          <span className="font-extrabold">Questions first?</span>
          {settings.phone ? (
            <a href={telHref(settings.phone)} className="text-link inline-flex items-center gap-1.5">
              <Icon name="phone" className="h-4 w-4" /> {settings.phone}
            </a>
          ) : null}
          {settings.email ? (
            <a href={`mailto:${settings.email}`} className="text-link inline-flex items-center gap-1.5">
              <Icon name="mail" className="h-4 w-4" /> Email us
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

/** Date and guest search across every cabin (homepage hero and the Cabins page). */
export function SearchWidget() {
  const code = settings.searchWidget
  if (code.trim()) return <HospitableEmbed code={code} minHeight={96} />
  return <WidgetPlaceholder title="Hospitable search widget" text="Check-in, check-out and guests, with a Find your happy place button" />
}
