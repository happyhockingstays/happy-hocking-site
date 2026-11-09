import data from 'virtual:content'
import type { Cabin, CabinSummary } from './types'

/** Site settings, policies and cabin cards. All of it comes from /content, edited in Pages CMS. */
export const settings = data.settings
export const policies = data.policies
export const cabins: CabinSummary[] = data.cabins
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
