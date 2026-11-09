// Loads and checks everything in /content: site settings, policies, cabins and reviews.
// Used by the Vite plugin (build and dev) and by scripts/check.mjs.
// Plain ESM JavaScript so Node can run the scripts without a TypeScript loader.
//
// Everything here is edited by the clients in Pages CMS (see .pages.yml), so missing
// optional values fall back to safe defaults instead of failing the build.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const CONTENT_DIR = path.join(ROOT, 'content')
export const CABINS_DIR = path.join(CONTENT_DIR, 'cabins')
export const REVIEWS_DIR = path.join(CONTENT_DIR, 'reviews')
export const SETTINGS_FILE = path.join(CONTENT_DIR, 'settings', 'site.yml')
export const POLICIES_FILE = path.join(CONTENT_DIR, 'settings', 'policies.yml')
export const SITE_URL = 'https://happyhocking.com'

const readYaml = (file) => (fs.existsSync(file) ? parseYaml(fs.readFileSync(file, 'utf8')) || {} : {})
const str = (v, d = '') => (v === undefined || v === null ? d : String(v).trim())
const num = (v, d = 0) => (Number.isFinite(Number(v)) && v !== '' && v !== null ? Number(v) : d)
const list = (v) => (Array.isArray(v) ? v.filter((x) => x !== null && x !== undefined && x !== '') : [])
const bool = (v) => v === true || v === 'true'

/** A cabin picked in Pages CMS is stored as its file path. Turn that (or a plain slug) into the slug. */
const cabinRef = (v) => path.basename(str(v)).replace(/\.ya?ml$/, '')

/** Image fields hold a site path like /images/cabins/pickle-hill/pool/pickle-hill-pool-001.jpg. */
const img = (v) => {
  const s = str(v)
  if (!s) return ''
  return s.startsWith('/') || s.startsWith('http') ? s : `/${s}`
}

const listFiles = (dir, ext) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(ext))
        .sort()
        .map((f) => path.join(dir, f))
    : []

/* ------------------------------------------------------------ settings */
export function loadSettings() {
  const d = readYaml(SETTINGS_FILE)
  return {
    name: str(d.name, 'Happy Hocking Stays'),
    legalName: str(d.legalName, 'Happy Hocking Stays, LLC'),
    phone: str(d.phone),
    email: str(d.email),
    instagram: str(d.instagram).replace(/^@/, ''),
    banner: { show: bool(d.banner?.show), text: str(d.banner?.text), link: str(d.banner?.link) },
    proof: { rating: str(d.proof?.rating, '4.9+'), reviewCount: str(d.proof?.reviewCount, '650+') },
    showStarRatings: bool(d.showStarRatings),
    searchWidget: str(d.searchWidget),
    mailchimpAction: str(d.mailchimpAction),
    gtmId: str(d.gtmId),
  }
}

export function loadPolicies() {
  const d = readYaml(POLICIES_FILE)
  const cancel = (c) => ({ label: str(c?.label), summary: str(c?.summary), details: str(c?.details) })
  return {
    checkIn: str(d.checkIn, '4:00 pm'),
    checkOut: str(d.checkOut, '11:00 am'),
    minStay: str(d.minStay, '2 nights'),
    minStayNote: str(d.minStayNote),
    ageToBook: str(d.ageToBook, '25+'),
    ageNote: str(d.ageNote),
    houseRules: list(d.houseRules).map((r) => str(r)),
    drivePlaces: list(d.drivePlaces).map((r) => str(r)),
    cancellation: { standard: cancel(d.cancellation?.standard), extended: cancel(d.cancellation?.extended) },
  }
}

/* ------------------------------------------------------------ reviews */
const CATEGORY_KEYS = ['cleanliness', 'accuracy', 'checkIn', 'communication', 'location', 'value']

/** Published reviews only. Private feedback never lives in the repo. */
export function loadReviews() {
  return listFiles(REVIEWS_DIR, '.yml')
    .map((file) => {
      const d = readYaml(file)
      const rating = num(d.rating, 0)
      return {
        id: path.basename(file, '.yml'),
        cabin: cabinRef(d.cabin),
        firstName: str(d.firstName),
        stayed: str(d.stayed),
        rating: rating >= 1 && rating <= 5 ? rating : 0,
        categories: Object.fromEntries(CATEGORY_KEYS.map((k) => [k, num(d[k], 0)]).filter(([, v]) => v >= 1 && v <= 5)),
        quote: str(d.quote),
        source: str(d.source, 'Direct'),
        published: bool(d.published),
      }
    })
    .filter((r) => r.published && r.quote && r.cabin)
}

/** Average of published reviews that carry an overall rating. Used only when "Show star ratings" is on. */
export function ratingSummary(reviews) {
  const rated = reviews.filter((r) => r.rating > 0)
  if (!rated.length) return null
  const avg = rated.reduce((s, r) => s + r.rating, 0) / rated.length
  return { average: Math.round(avg * 10) / 10, count: rated.length }
}

/* ------------------------------------------------------------ cabins */
export const listCabinFiles = () => listFiles(CABINS_DIR, '.yml')
export const cabinSlug = (file) => path.basename(file, '.yml')

const REQUIRED = ['name', 'tagline', 'town', 'sleeps', 'bedrooms', 'baths']

export function readCabin(file, reviews = loadReviews()) {
  const slug = cabinSlug(file)
  const d = readYaml(file)
  const missing = REQUIRED.filter((k) => d[k] === undefined || d[k] === null || d[k] === '')
  if (missing.length) throw new Error(`content/cabins/${slug}.yml is missing: ${missing.join(', ')}`)
  const name = str(d.name)
  const mine = reviews.filter((r) => r.cabin === slug)
  return {
    slug,
    name,
    shortName: str(d.shortName, name),
    order: num(d.order, 99),
    hidden: bool(d.hidden),
    isNew: bool(d.isNew),
    tagline: str(d.tagline),
    cardLine: str(d.cardLine),
    town: str(d.town),
    sleeps: num(d.sleeps),
    bedrooms: num(d.bedrooms),
    beds: num(d.beds),
    baths: str(d.baths),
    gamesAndSports: bool(d.gamesAndSports),
    chips: list(d.chips).map((c) => str(c)),
    seoTitle: str(d.seoTitle),
    seoDescription: str(d.seoDescription),
    blurb: str(d.blurb),
    about: str(d.about),
    aboutMore: str(d.aboutMore),
    heroImage: img(d.heroImage),
    heroAlt: str(d.heroAlt),
    keyShots: list(d.keyShots).map((s) => ({ image: img(s?.image), alt: str(s?.alt), label: str(s?.label) })),
    highlights: list(d.highlights).map((h) => ({ title: str(h?.title), text: str(h?.text), image: img(h?.image), alt: str(h?.alt) })),
    rooms: list(d.rooms).map((r) => ({
      name: str(r?.name),
      floor: str(r?.floor),
      beds: str(r?.beds),
      sleeps: num(r?.sleeps),
      note: str(r?.note),
      image: img(r?.image),
      alt: str(r?.alt),
    })),
    sleepingNote: str(d.sleepingNote),
    amenities: list(d.amenities).map((g) => ({
      group: str(g?.group),
      items: list(g?.items).map((i) => ({ icon: str(i?.icon, 'sparkle'), label: str(i?.label) })),
    })),
    allAmenities: list(d.allAmenities).map((g) => ({ group: str(g?.group), items: list(g?.items).map((i) => str(i)) })),
    poolSeason: str(d.poolSeason),
    poolNote: str(d.poolNote),
    driveTimes: list(d.driveTimes).map((t) => ({ place: str(t?.place), time: str(t?.time) })),
    areaNote: str(d.areaNote),
    checkOut: str(d.checkOut),
    quietHours: str(d.quietHours),
    cancellation: str(d.cancellation, 'standard') === 'extended' ? 'extended' : 'standard',
    extraRules: list(d.extraRules).map((r) => str(r)),
    goodToKnow: list(d.goodToKnow).map((r) => str(r)),
    faqs: list(d.faqs).map((f) => ({ q: str(f?.q), a: str(f?.a) })).filter((f) => f.q && f.a),
    similar: list(d.similar).map((s) => cabinRef(s)),
    airbnbRating: str(d.airbnbRating),
    airbnbReviews: num(d.airbnbReviews),
    permit: str(d.permit),
    bookingWidget: str(d.bookingWidget),
    gallery: list(d.gallery)
      .map((g) => ({
        name: str(g?.name),
        images: list(g?.images)
          .map((i) => ({ image: img(i?.image), caption: str(i?.caption), alt: str(i?.alt) }))
          .filter((i) => i.image),
      }))
      .filter((g) => g.images.length),
    reviews: mine,
    ratingSummary: ratingSummary(mine),
  }
}

/** Card-sized data for every visible cabin, in display order. Goes into the shared bundle, so keep it small. */
export function cabinSummary(c) {
  return {
    slug: c.slug,
    name: c.name,
    shortName: c.shortName,
    isNew: c.isNew,
    tagline: c.tagline,
    cardLine: c.cardLine,
    town: c.town,
    sleeps: c.sleeps,
    bedrooms: c.bedrooms,
    baths: c.baths,
    gamesAndSports: c.gamesAndSports,
    chips: c.chips,
    heroImage: c.heroImage,
    heroAlt: c.heroAlt,
    ratingSummary: c.ratingSummary,
  }
}

export function loadCabins() {
  const reviews = loadReviews()
  return listCabinFiles()
    .map((f) => readCabin(f, reviews))
    .filter((c) => !c.hidden)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
}
