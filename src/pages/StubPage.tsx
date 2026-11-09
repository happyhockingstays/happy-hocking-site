import { Sparkle } from '@/components/Icon'
import { SiteLink } from '@/components/SiteLink'

/** Stand-in for a page that hasn't been built yet in the first pass. Replaced page by page. */
export function StubPage({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return (
    <section className="section sec-cream min-h-[60svh]">
      <div className="container-x max-w-3xl text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-display mt-3">{title}</h1>
        <p className="lead mx-auto mt-6 flex max-w-xl items-start justify-center gap-2.5 text-left">
          <Sparkle className="mt-2 h-4 w-4 shrink-0 text-terracotta-deep" />
          <span>Page in progress. {note}</span>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <SiteLink to="/cabins" className="btn btn-book">
            See all cabins
          </SiteLink>
        </div>
      </div>
    </section>
  )
}
