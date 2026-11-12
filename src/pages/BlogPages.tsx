import { ClosingBand } from '@/components/ClosingBand'
import { FaqList } from '@/components/Faq'
import { InsiderSignup } from '@/components/Forms'
import { Icon } from '@/components/Icon'
import { Photo } from '@/components/Photo'
import { SiteLink } from '@/components/SiteLink'
import { formatDate, posts } from '@/lib/content'
import type { PostMeta } from '@/lib/types'

/** Posts are markdown files in content/blog, written in Pages CMS (Blog posts). The file name is the URL. */
function PostCard({ post: p }: { post: PostMeta }) {
  return (
    <SiteLink to={`/blog/${p.slug}`} className="card card-link flex h-full flex-col overflow-hidden">
      <div className="card-photo relative">
        <Photo src={p.cover} alt={p.coverAlt || p.title} label="Post cover" ratio="16 / 10" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" tint="mustard" />
        {p.draft ? <span className="chip chip-terracotta absolute left-3 top-3">Draft</span> : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {p.category ? <p className="eyebrow">{p.category}</p> : null}
        <h2 className="h-card">{p.title}</h2>
        {p.description ? <p className="flex-1">{p.description}</p> : <span className="flex-1" />}
        <p className="meta mt-2">{[formatDate(p.date), `${p.readingMinutes} min read`].filter(Boolean).join(' · ')}</p>
      </div>
    </SiteLink>
  )
}

export function BlogIndexPage() {
  return (
    <>
      <section className="sec-sage-tint on-tint border-b-2 border-forest py-12 md:py-16">
        <div className="container-x">
          <p className="eyebrow">Blog</p>
          <h1 className="h-display mt-3">Hocking Hills guides and trip ideas</h1>
          <p className="lead mt-4 max-w-2xl">Seasonal guides, trail picks and plans for your group, from hosts who live for a good weekend in the hills.</p>
        </div>
      </section>

      <section className="section sec-cream">
        <div className="container-x">
          {posts.length ? (
            <ul className="shadow-rotate grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug} data-reveal>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="card shadow-mustard mx-auto max-w-2xl p-7 md:p-9">
              <h2 className="h-card">The first guides are on the way</h2>
              <p className="mt-3">Join the insider list and we'll send new guides, open weekends and deals as they land.</p>
              <div className="mt-6">
                <InsiderSignup id="blog-insider" />
              </div>
            </div>
          )}
        </div>
      </section>

      <ClosingBand />
    </>
  )
}

export function BlogPostPage({ post: p, html }: { post: PostMeta; html: string }) {
  const more = posts.filter((x) => x.slug !== p.slug).slice(0, 3)
  return (
    <>
      <article>
        <header className="sec-sage-tint on-tint border-b-2 border-forest py-10 md:py-14">
          <div className="container-x max-w-4xl">
            <p className="meta">
              <SiteLink to="/blog" className="text-link inline-flex items-center gap-1.5">
                <Icon name="chevron-left" className="h-4 w-4" /> All posts
              </SiteLink>
            </p>
            <p className="eyebrow mt-6 flex flex-wrap items-center gap-3">
              {p.category || 'Blog'}
              {p.draft ? <span className="chip chip-terracotta normal-case tracking-normal">Draft, hidden after launch</span> : null}
            </p>
            <h1 className="h-display mt-3 !text-[clamp(2.125rem,5vw,3.5rem)]">{p.title}</h1>
            {p.description ? <p className="lead mt-4 max-w-3xl">{p.description}</p> : null}
            <p className="meta mt-5">{[formatDate(p.date), `${p.readingMinutes} min read`].filter(Boolean).join(' · ')}</p>
          </div>
        </header>

        <div className="section sec-cream">
          <div className="container-x max-w-4xl">
            {p.cover ? (
              <div className="frame shadow-mustard mb-10">
                <Photo src={p.cover} alt={p.coverAlt || p.title} ratio="16 / 9" priority sizes="(min-width: 900px) 840px, 100vw" />
              </div>
            ) : null}
            <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
            {p.faqs.length ? (
              <section className="mt-14" aria-labelledby="post-faqs">
                <h2 id="post-faqs" className="h-section">
                  Frequently asked questions
                </h2>
                <div className="mt-6">
                  <FaqList items={p.faqs} />
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </article>

      {more.length ? (
        <section className="section sec-sage-tint on-tint sec-line">
          <div className="container-x">
            <h2 className="h-section">Keep reading</h2>
            <ul className="shadow-rotate mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((x) => (
                <li key={x.slug}>
                  <PostCard post={x} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Every post ends with a booking band. The insider list signup follows in the footer. */}
      <ClosingBand text="Pick your dates and book direct to skip the booking-site service fees." />
    </>
  )
}
