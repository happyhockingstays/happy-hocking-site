import data from 'virtual:content'
import type { Cabin, CabinSummary, Pages, PostMeta, Review } from './types'

/** Site settings, policies and cabin cards. All of it comes from /content, edited in Pages CMS. */
export const settings = data.settings
export const policies = data.policies
export const cabins: CabinSummary[] = data.cabins
export const pages: Pages = data.pages
/** Published guest reviews, in file order. Empty until the hosts add the first one in Pages CMS. */
export const reviews: Review[] = data.reviews
export const posts: PostMeta[] = data.posts
export const cabinBySlug = (slug: string) => cabins.find((c) => c.slug === slug)

export const site = {
  name: settings.name,
  url: 'https://happyhocking.com',
  region: 'Hocking Hills, Ohio',
}

/** Lazy loaders, one chunk per cabin page (gallery, rooms, amenities, FAQs). */
const loaders = import.meta.glob<{ default: Cabin }>('/content/cabins/*.yml')
export async function loadCabin(slug: string): Promise<Cabin | undefined> {
  if (!cabinBySlug(slug)) return undefined // hidden or removed
  const load = loaders[`/content/cabins/${slug}.yml`]
  return load ? (await load()).default : undefined
}

/** Group pages and filters: 13 or more guests is a large group (per the questionnaire). */
export const isLargeGroup = (c: CabinSummary) => c.sleeps >= 13

export const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, '')}`

/** Lazy loaders, one chunk per blog post body. */
const postBodies = import.meta.glob<{ default: { html: string } }>('/content/blog/*.md')
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug)
export async function loadPostBody(slug: string): Promise<{ html: string } | undefined> {
  if (!postBySlug(slug)) return undefined // draft or removed
  const load = postBodies[`/content/blog/${slug}.md`]
  return load ? (await load()).default : undefined
}

export function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

/** Questions flagged "Show on the homepage" in the FAQs file. */
export const homeFaqs = pages.faqs.groups.flatMap((g) => g.items.filter((i) => i.home))
