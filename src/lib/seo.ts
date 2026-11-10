import { site } from './content'
import { settings } from './content'
import type { Cabin, Policies, PostMeta } from './types'

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

/** Per-page <head> tags: title, description, canonical, Open Graph, Twitter, JSON-LD. */
export function seo({ title, description, path, image = OG_DEFAULT, jsonLd, noindex, article }: SeoInput) {
  const url = site.url + (path === '/' ? '/' : path)
  const img = image.startsWith('http') ? image : site.url + image
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
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: img },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: img },
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
