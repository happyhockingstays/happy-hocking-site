import { ClosingBand } from '@/components/ClosingBand'
import { Icon } from '@/components/Icon'
import { Photo } from '@/components/Photo'
import { SiteLink } from '@/components/SiteLink'
import { pages } from '@/lib/content'

/** About: the story and the team. Words and photos come from content/pages/about.yml (Pages CMS: Pages > About). */
export function AboutPage() {
  const p = pages.about
  const paragraphs = p.story.text.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean)
  return (
    <>
      <section className="sec-sage-tint on-tint border-b-2 border-forest py-12 md:py-16">
        <div className="container-x grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <p className="eyebrow">{p.hero.eyebrow}</p>
            <h1 className="h-display mt-3">{p.hero.heading}</h1>
            {p.hero.intro ? <p className="lead mt-5">{p.hero.intro}</p> : null}
          </div>
          <div className="frame shadow-terracotta">
            <Photo src={p.hero.image} alt={p.hero.alt} ratio="4 / 3" priority sizes="(min-width: 768px) 50vw, 100vw" label="A favorite cabin moment" />
          </div>
        </div>
      </section>

      {/* Our story: Natalie is writing it. Until then a labeled placeholder holds the spot. */}
      <section className="section sec-cream">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4" data-reveal>
            <p className="eyebrow">How we got here</p>
            <h2 className="h-section mt-2">{p.story.heading}</h2>
          </div>
          <div className="lg:col-span-8" data-reveal>
            {paragraphs.length ? (
              <div className="prose-site max-w-[65ch] text-lg">
                {paragraphs.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-forest bg-card px-6 py-10 text-center">
                <p className="font-extrabold">Our story goes here</p>
                <p className="meta mt-1">Natalie is writing it. Add it in Pages CMS under Pages, About, Our story</p>
              </div>
            )}
            {p.story.image ? (
              <div className="frame shadow-mustard mt-8">
                <Photo src={p.story.image} alt={p.story.alt} ratio="16 / 9" sizes="(min-width: 1024px) 760px, 100vw" />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {p.team.members.length ? (
        <section className="section sec-mustard-tint on-tint sec-line">
          <div className="container-x">
            <div data-reveal>
              {p.team.eyebrow ? <p className="eyebrow">{p.team.eyebrow}</p> : null}
              <h2 className="h-section mt-2">{p.team.heading}</h2>
            </div>
            <ul className="shadow-rotate mt-8 grid max-w-3xl gap-7 sm:grid-cols-2">
              {p.team.members.map((m) => (
                <li key={m.name} className="card overflow-hidden" data-reveal>
                  <div className="card-photo">
                    <Photo src={m.photo} alt={`${m.name} of Happy Hocking Stays`} ratio="1 / 1" sizes="(min-width: 640px) 380px, 100vw" label={m.name} position="center top" />
                  </div>
                  <div className="p-5">
                    <h3 className="h-card">{m.name}</h3>
                    {m.role ? <p className="eyebrow mt-1.5 !text-forest">{m.role}</p> : null}
                    {m.bio ? <p className="mt-3">{m.bio}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {p.promises.items.length ? (
        <section className="section sec-forest on-forest">
          <div className="container-x">
            <h2 className="h-section" data-reveal>
              {p.promises.heading}
            </h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
              {p.promises.items.map((x) => (
                <li key={x.title} data-reveal>
                  <span className="icon-tile">
                    <Icon name={x.icon} />
                  </span>
                  <h3 className="mt-4 font-sans text-xl font-extrabold leading-snug">{x.title}</h3>
                  <p className="soft mt-2">{x.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-10" data-reveal>
              <SiteLink to="/co-hosting" className="text-link">
                Looking for a co-host? See how it works
              </SiteLink>
            </p>
          </div>
        </section>
      ) : null}

      <ClosingBand />
    </>
  )
}
