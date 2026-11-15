import { settings, shareImages, site } from './content'
import type { Cabin, CabinSummary, Policies, PostMeta } from './types'

interface SeoInput {
  title: string
  description: string
  path: string
  image?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  /** Private pages (the review form) and draft posts stay out of search results. */
  noindex?: boolean
  /** Blog posts: marks the page as an article, with its dates. */
  article?: { published: string; modified: string }
}

const OG_DEFAULT = '/images/brand/og-happy-hocking-stays.jpg'
const PRELAUNCH = import.meta.env.VITE_NOINDEX === 'true'

/**
 * The share image for a page: the picture that shows when its link is texted or posted.
 * Each page has its own 1200 x 630 card in public/images/share, named for the page
 * (/cabins/pickle-hill is cabins-pickle-hill.jpg), made by scripts/make-share-images.py.
 * A page without one yet (a brand new post) falls back to its own photo, then to the site card.
 */
export const shareKey = (path: string) => (path === '/' ? 'home' : path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-'))
function shareImage(path: string, fallback?: string) {
  const key = shareKey(path)
  if (shareImages.includes(key)) return { src: `/images/share/${key}.jpg`, card: true }
  return { src: fallback || OG_DEFAULT, card: !fallback }
}

/** Per-page <head> tags: title, description, canonical, Open Graph, Twitter, JSON-LD. */
export function seo({ title, description, path, image, jsonLd, noindex, article }: SeoInput) {
  const url = site.url + (path === '/' ? '/' : path)
  const share = shareImage(path, image)
  const img = share.src.startsWith('http') ? share.src : site.url + share.src
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...(noindex || PRELAUNCH ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
      { property: 'og:type', content: article ? 'article' : 'website' },
      ...(article?.published ? [{ property: 'article:published_time', content: article.published }] : []),
      ...(article?.modified ? [{ property: 'article:modified_time', content: article.modified }] : []),
      { property: 'og:site_name', content: site.name },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: img },
      // Every share card is the same size. A fallback photo isn't, so its size is left out.
      ...(share.card
        ? [
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
          ]
        : []),
      { property: 'og:image:alt', content: title },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: img },
      { name: 'twitter:image:alt', content: title },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: ld.map((o) => ({ type: 'application/ld+json', children: JSON.stringify(o) })),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: site.url + it.path,
    })),
  }
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

const to24h = (t: string) => {
  const m = /(\d{1,2}):(\d{2})\s*(am|pm)/i.exec(t)
  if (!m) return undefined
  const h = (Number(m[1]) % 12) + (m[3].toLowerCase() === 'pm' ? 12 : 0)
  return `${String(h).padStart(2, '0')}:${m[2]}`
}

/** Structured data for one cabin. Town only: street addresses are shared after booking. */
export function cabinJsonLd(c: Cabin, policies: Policies) {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    '@id': `${site.url}/cabins/${c.slug}#rental`,
    name: c.name,
    description: c.blurb || c.cardLine,
    url: `${site.url}/cabins/${c.slug}`,
    image: [c.heroImage, ...c.keyShots.map((s) => s.image)].filter(Boolean).map((i) => site.url + i),
    address: { '@type': 'PostalAddress', addressLocality: c.town, addressRegion: 'OH', addressCountry: 'US' },
    containsPlace: {
      '@type': 'Accommodation',
      occupancy: { '@type': 'QuantitativeValue', value: c.sleeps },
      numberOfBedrooms: c.bedrooms,
    },
    checkinTime: to24h(policies.checkIn),
    checkoutTime: to24h(c.checkOut || policies.checkOut),
    petsAllowed: false,
    brand: { '@type': 'Brand', name: site.name },
  }
  return ld
}

const org = () => ({ '@type': 'Organization', '@id': `${site.url}/#org`, name: site.name, url: site.url, logo: `${site.url}/icon-512.png` })

/** The site itself, for the homepage. Tells search engines the site's name. */
export function websiteJsonLd() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.url}/#website`, name: site.name, url: site.url, publisher: { '@id': `${site.url}/#org` } }
}

/** A list of cabins, for a collection page. Each item points at the cabin's own page. */
export function cabinListJsonLd(name: string, path: string, list: CabinSummary[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${site.url}${path}#page`,
    name,
    url: site.url + path,
    isPartOf: { '@id': `${site.url}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: list.length,
      itemListElement: list.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: `${site.url}/cabins/${c.slug}` })),
    },
  }
}

/** Who runs the site, for the homepage. Town-level only: no street address. */
export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    ...org(),
    description: 'Private Hocking Hills cabins with pools and hot tubs, and co-hosting for local vacation homeowners.',
    areaServed: 'Hocking Hills, Ohio',
    ...(settings.phone ? { telephone: `+1-${settings.phone}` } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.instagram ? { sameAs: [`https://www.instagram.com/${settings.instagram}`] } : {}),
  }
}

export function postJsonLd(p: PostMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    ...(p.cover ? { image: site.url + p.cover } : {}),
    datePublished: p.date,
    dateModified: p.updated || p.date,
    author: org(),
    publisher: org(),
    mainEntityOfPage: `${site.url}/blog/${p.slug}`,
  }
}
