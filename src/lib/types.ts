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
