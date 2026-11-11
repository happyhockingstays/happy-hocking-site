// Loads and checks everything in /content: site settings, policies, cabins and reviews.
// Used by the Vite plugin (build and dev) and by scripts/check.mjs.
// Plain ESM JavaScript so Node can run the scripts without a TypeScript loader.
//
// Everything here is edited by the clients in Pages CMS (see .pages.yml), so missing
// optional values fall back to safe defaults instead of failing the build.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Marked } from 'marked'
import { parse as parseYaml } from 'yaml'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const CONTENT_DIR = path.join(ROOT, 'content')
export const CABINS_DIR = path.join(CONTENT_DIR, 'cabins')
export const REVIEWS_DIR = path.join(CONTENT_DIR, 'reviews')
export const SETTINGS_FILE = path.join(CONTENT_DIR, 'settings', 'site.yml')
export const POLICIES_FILE = path.join(CONTENT_DIR, 'settings', 'policies.yml')
export const PAGES_DIR = path.join(CONTENT_DIR, 'pages')
export const BLOG_DIR = path.join(CONTENT_DIR, 'blog')
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
    mailchimpSiteScript: str(d.mailchimpSiteScript),
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

/* ------------------------------------------------------------ pages */
const photo = (o) => ({ image: img(o?.image), alt: str(o?.alt) })
const titled = (v) => list(v).map((i) => ({ icon: str(i?.icon, 'sparkle'), title: str(i?.title), text: str(i?.text) })).filter((i) => i.title)
const qa = (v) => list(v).map((f) => ({ q: str(f?.q), a: str(f?.a) })).filter((f) => f.q && f.a)

/** Words and photos for Home, Co-hosting, About and FAQs. Empty values hide their piece of the page. */
export function loadPages() {
  const h = readYaml(path.join(PAGES_DIR, 'home.yml'))
  const c = readYaml(path.join(PAGES_DIR, 'co-hosting.yml'))
  const a = readYaml(path.join(PAGES_DIR, 'about.yml'))
  const f = readYaml(path.join(PAGES_DIR, 'faqs.yml'))
  return {
    home: {
      hero: { eyebrow: str(h.hero?.eyebrow), lead: str(h.hero?.lead), ...photo(h.hero), video: img(h.hero?.video), videoPhone: img(h.hero?.videoPhone) },
      cabins: { eyebrow: str(h.cabins?.eyebrow, 'Our cabins'), intro: str(h.cabins?.intro) },
      story: { eyebrow: str(h.story?.eyebrow), heading: str(h.story?.heading), text: str(h.story?.text), linkLabel: str(h.story?.linkLabel), ...photo(h.story) },
      reviews: { intro: str(h.reviews?.intro) },
      cohost: { eyebrow: str(h.cohost?.eyebrow), heading: str(h.cohost?.heading, 'Looking for a co-host?'), text: str(h.cohost?.text), points: list(h.cohost?.points).map((x) => str(x)), ...photo(h.cohost) },
      area: { eyebrow: str(h.area?.eyebrow), heading: str(h.area?.heading), text: str(h.area?.text), linkLabel: str(h.area?.linkLabel), ...photo(h.area) },
      faqs: { eyebrow: str(h.faqs?.eyebrow, 'FAQs'), heading: str(h.faqs?.heading, 'Good to know') },
      closing: { heading: str(h.closing?.heading, 'Find your happy place'), text: str(h.closing?.text) },
    },
    cohosting: {
      hero: { eyebrow: str(c.hero?.eyebrow, 'Hocking Hills co-hosting'), lead: str(c.hero?.lead), ...photo(c.hero) },
      threeThings: { heading: str(c.threeThings?.heading), items: titled(c.threeThings?.items) },
      services: { eyebrow: str(c.services?.eyebrow), heading: str(c.services?.heading), intro: str(c.services?.intro), items: titled(c.services?.items) },
      ownership: { heading: str(c.ownership?.heading), points: titled(c.ownership?.points) },
      proof: { eyebrow: str(c.proof?.eyebrow), heading: str(c.proof?.heading), intro: str(c.proof?.intro), replyTime: str(c.proof?.replyTime) },
      steps: { eyebrow: str(c.steps?.eyebrow), heading: str(c.steps?.heading), intro: str(c.steps?.intro), items: titled(c.steps?.items) },
      testimonials: list(c.testimonials).map((t) => ({ quote: str(t?.quote), name: str(t?.name), home: str(t?.home) })).filter((t) => t.quote),
      form: { eyebrow: str(c.form?.eyebrow, 'Get in touch'), heading: str(c.form?.heading), text: str(c.form?.text) },
      faqs: qa(c.faqs),
    },
    about: {
      hero: { eyebrow: str(a.hero?.eyebrow, 'About us'), heading: str(a.hero?.heading), intro: str(a.hero?.intro), ...photo(a.hero) },
      story: { heading: str(a.story?.heading, 'Our story'), text: str(a.story?.text), ...photo(a.story) },
      team: {
        eyebrow: str(a.team?.eyebrow),
        heading: str(a.team?.heading),
        members: list(a.team?.members).map((m) => ({ name: str(m?.name), role: str(m?.role), bio: str(m?.bio), photo: img(m?.photo) })).filter((m) => m.name),
      },
      promises: { heading: str(a.promises?.heading), items: titled(a.promises?.items) },
    },
    faqs: {
      intro: str(f.intro),
      groups: list(f.groups)
        .map((g) => ({
          title: str(g?.title),
          items: list(g?.items).map((i) => ({ q: str(i?.q), a: str(i?.a), home: bool(i?.home) })).filter((i) => i.q && i.a),
        }))
        .filter((g) => g.items.length),
    },
  }
}

/* ------------------------------------------------------------ blog */
export const listPostFiles = () => listFiles(BLOG_DIR, '.md')
const asDate = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : str(v).slice(0, 10))

function splitFrontmatter(raw, file) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!m) throw new Error(`${file}: the post is missing its settings block (the part between the --- lines)`)
  return { data: parseYaml(m[1]) || {}, body: m[2] }
}

/** One post: settings from the top of the file, plus the markdown body. The file name is the URL. */
export function readPost(file) {
  const slug = path.basename(file, '.md')
  const { data, body } = splitFrontmatter(fs.readFileSync(file, 'utf8'), `content/blog/${slug}.md`)
  if (!str(data.title)) throw new Error(`content/blog/${slug}.md needs a title`)
  const words = (body.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) || []).length
  return {
    meta: {
      slug,
      title: str(data.title),
      seoTitle: str(data.seoTitle),
      description: str(data.description),
      date: asDate(data.date),
      updated: asDate(data.updated || data.date),
      category: str(data.category),
      cover: img(data.cover),
      coverAlt: str(data.coverAlt),
      draft: bool(data.draft),
      readingMinutes: Math.max(1, Math.round(words / 220)),
    },
    body,
  }
}

/**
 * Posts for the blog index, newest first. Drafts are left out, except while the site is still
 * blocked from search engines (before launch), so the template can be reviewed with a sample post.
 */
export function loadPosts({ includeDrafts = false } = {}) {
  return listPostFiles()
    .map((f) => readPost(f).meta)
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)))
}

const slugifyHeading = (s) =>
  String(s)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Markdown to HTML. Photos lazy-load, headings get anchors and outside links open in a new tab. */
export function renderPost(body) {
  const marked = new Marked({ gfm: true })
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens)
        const level = Math.min(Math.max(depth, 2), 4) // the page title is the only h1
        return `<h${level} id="${slugifyHeading(inner)}">${inner}</h${level}>\n`
      },
      image({ href, title, text }) {
        const cap = title ? `<figcaption>${title}</figcaption>` : ''
        return `<figure><img src="${href}" alt="${String(text || '').replace(/"/g, '&quot;')}" loading="lazy" decoding="async" />${cap}</figure>`
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens)
        const outside = /^https?:\/\//.test(href) && !href.startsWith(SITE_URL)
        const local = href.startsWith(SITE_URL) ? href.slice(SITE_URL.length) || '/' : href
        return `<a href="${local}"${title ? ` title="${title}"` : ''}${outside ? ' target="_blank" rel="noopener"' : ''}>${inner}</a>`
      },
    },
  })
  // A photo on its own line arrives wrapped in a paragraph. Unwrap it so the figure is valid HTML.
  const html = marked.parse(body).replace(/<p>(<figure>[\s\S]*?<\/figure>)<\/p>/g, '$1')
  return { html }
}
