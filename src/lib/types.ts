/** Shapes of the YAML content in /content, after content/lib.mjs has normalized it. */

export interface Settings {
  name: string
  legalName: string
  phone: string
  email: string
  instagram: string
  banner: { show: boolean; text: string; link: string }
  proof: { rating: string; reviewCount: string }
  showStarRatings: boolean
  searchWidget: string
  mailchimpAction: string
  mailchimpSiteScript: string
  gtmId: string
}

export interface CancellationPolicy {
  label: string
  summary: string
  details: string
}

export interface Policies {
  checkIn: string
  checkOut: string
  minStay: string
  minStayNote: string
  ageToBook: string
  ageNote: string
  houseRules: string[]
  drivePlaces: string[]
  cancellation: { standard: CancellationPolicy; extended: CancellationPolicy }
}

export interface Review {
  id: string
  cabin: string
  firstName: string
  stayed: string
  rating: number
  categories: Record<string, number>
  quote: string
  source: string
  published: boolean
}

export interface RatingSummary {
  average: number
  count: number
}

export interface CabinSummary {
  slug: string
  name: string
  shortName: string
  isNew: boolean
  tagline: string
  cardLine: string
  town: string
  sleeps: number
  bedrooms: number
  baths: string
  gamesAndSports: boolean
  chips: string[]
  heroImage: string
  heroAlt: string
  ratingSummary: RatingSummary | null
}

export interface GalleryImage {
  image: string
  caption: string
  alt: string
}

export interface GalleryGroup {
  name: string
  images: GalleryImage[]
}

export interface Room {
  name: string
  floor: string
  beds: string
  sleeps: number
  note: string
  image: string
  alt: string
}

export interface Cabin extends CabinSummary {
  order: number
  hidden: boolean
  beds: number
  seoTitle: string
  seoDescription: string
  blurb: string
  aboutHeading: string
  about: string
  aboutMore: string
  keyShots: { image: string; alt: string; label: string }[]
  highlights: { title: string; text: string; image: string; alt: string }[]
  rooms: Room[]
  sleepingNote: string
  amenities: { group: string; items: { icon: string; label: string }[] }[]
  allAmenities: { group: string; items: string[] }[]
  poolSeason: string
  poolNote: string
  driveTimes: { place: string; time: string }[]
  areaNote: string
  checkOut: string
  quietHours: string
  cancellation: 'standard' | 'extended'
  extraRules: string[]
  goodToKnow: string[]
  faqs: { q: string; a: string }[]
  similar: string[]
  airbnbRating: string
  airbnbReviews: number
  permit: string
  bookingWidget: string
  gallery: GalleryGroup[]
  reviews: Review[]
}

/* ---------- Page copy (content/pages/*.yml) ---------- */
export interface PhotoRef {
  image: string
  alt: string
}
export interface TitledItem {
  icon: string
  title: string
  text: string
}
export interface Qa {
  q: string
  a: string
}

export interface Pages {
  home: {
    hero: PhotoRef & { eyebrow: string; lead: string; video: string; videoPhone: string }
    cabins: { eyebrow: string; intro: string }
    story: PhotoRef & { eyebrow: string; heading: string; text: string; linkLabel: string }
    reviews: { intro: string }
    cohost: PhotoRef & { eyebrow: string; heading: string; text: string; points: string[] }
    area: PhotoRef & { eyebrow: string; heading: string; text: string; linkLabel: string }
    faqs: { eyebrow: string; heading: string }
    closing: { heading: string; text: string }
  }
  cohosting: {
    hero: PhotoRef & { eyebrow: string; lead: string }
    threeThings: { heading: string; items: TitledItem[] }
    services: { eyebrow: string; heading: string; intro: string; items: TitledItem[] }
    ownership: { heading: string; points: TitledItem[] }
    proof: { eyebrow: string; heading: string; intro: string; replyTime: string }
    steps: { eyebrow: string; heading: string; intro: string; items: TitledItem[] }
    testimonials: { quote: string; name: string; home: string }[]
    form: { eyebrow: string; heading: string; text: string }
    faqs: Qa[]
  }
  about: {
    hero: PhotoRef & { eyebrow: string; heading: string; intro: string }
    story: PhotoRef & { heading: string; text: string }
    team: { eyebrow: string; heading: string; members: { name: string; role: string; bio: string; photo: string }[] }
    promises: { heading: string; items: TitledItem[] }
  }
  faqs: {
    intro: string
    groups: { title: string; items: (Qa & { home: boolean })[] }[]
  }
}

/* ---------- Blog (content/blog/*.md) ---------- */
export interface PostMeta {
  slug: string
  title: string
  seoTitle: string
  description: string
  date: string
  updated: string
  category: string
  cover: string
  coverAlt: string
  /** Questions shown under the post, with FAQ schema */
  faqs: Qa[]
  draft: boolean
  readingMinutes: number
}
