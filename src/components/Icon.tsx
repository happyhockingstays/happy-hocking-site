import type { ReactNode, SVGProps } from 'react'
import {
  AirVent,
  ArrowRight,
  Baby,
  Bath,
  BedDouble,
  CalendarDays,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  CookingPot,
  Dices,
  DoorOpen,
  Fish,
  Flame,
  FlameKindling,
  Gamepad2,
  IdCard,
  Images,
  Info,
  Joystick,
  Kayak,
  KeyRound,
  Laptop,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Moon,
  Mountain,
  Music,
  Phone,
  Plus,
  PlugZap,
  Refrigerator,
  ScrollText,
  Sofa,
  Star,
  Sun,
  Target,
  Telescope,
  ThermometerSun,
  Trees,
  Trophy,
  Tv,
  Users,
  Utensils,
  Volleyball,
  WashingMachine,
  Waves,
  WavesLadder,
  Wifi,
  X,
  type LucideIcon,
} from 'lucide-react'

/**
 * Brand icons: line icons with a 2px stroke and rounded ends, in the current text color.
 * Most come from the free Lucide set. Hot tub, sauna, pickleball, the sparkle and Instagram
 * are drawn here to match (24px grid, 2px stroke, round caps and joins).
 * No emoji anywhere on the site: these do that job.
 */
type SvgProps = SVGProps<SVGSVGElement>

const base = (children: ReactNode) =>
  function Custom(props: SvgProps) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        {children}
      </svg>
    )
  }

const HotTub = base(
  <>
    <path d="M3 12h18v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
    <path d="M7 16v0M12 16v0M17 16v0" />
    <path d="M8 8c-1-1 1-2 0-3.5M12 8c-1-1 1-2 0-3.5M16 8c-1-1 1-2 0-3.5" />
  </>,
)
const Sauna = base(
  <>
    <path d="M3 21V9l9-6 9 6v12" />
    <path d="M3 21h18" />
    <path d="M9 21v-4h6v4" />
    <path d="M10 13c-.8-.8.8-1.6 0-2.8M14 13c-.8-.8.8-1.6 0-2.8" />
  </>,
)
const Pickleball = base(
  <>
    <path d="M13.5 3.5a5 5 0 0 1 7 7l-5.2 5.2a3 3 0 0 1-3.6.5L9 14.5 4.5 19" />
    <path d="M9 14.5 7.3 12.3a3 3 0 0 1 .5-3.6z" />
    <circle cx="5.5" cy="6.5" r="2.5" />
    <path d="M3 21l1.5-2" />
  </>,
)
const Bocce = base(
  <>
    <circle cx="8" cy="15" r="5" />
    <circle cx="17.5" cy="8.5" r="3.5" />
    <path d="M5.5 13.5c1.5-1 3.5-1 5 0" />
  </>,
)
const Instagram = base(
  <>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5v0" />
  </>,
)

/** The monogram's four-point star. Used for bullets, dividers and one accent per headline. */
export function Sparkle({ className = '', ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...props}>
      <path d="M12 0c.9 6.3 5.7 11.1 12 12-6.3.9-11.1 5.7-12 12-.9-6.3-5.7-11.1-12-12 6.3-.9 11.1-5.7 12-12z" />
    </svg>
  )
}

const icons = {
  // Stats
  users: Users,
  bed: BedDouble,
  bath: Bath,
  // Outdoors
  pool: WavesLadder,
  'heated-pool': ThermometerSun,
  'hot-tub': HotTub,
  sauna: Sauna,
  'fire-pit': FlameKindling,
  grill: Flame,
  lake: Waves,
  kayak: Kayak,
  fish: Fish,
  trails: Mountain,
  woods: Trees,
  stars: Telescope,
  deck: Sun,
  parking: Car,
  ev: PlugZap,
  // Games and sports
  pickleball: Pickleball,
  'sport-court': Trophy,
  basketball: Volleyball,
  bocce: Bocce,
  'game-room': Gamepad2,
  arcade: Joystick,
  'pool-table': Target,
  games: Dices,
  music: Music,
  // Inside
  wifi: Wifi,
  tv: Tv,
  ac: AirVent,
  washer: WashingMachine,
  sofa: Sofa,
  workspace: Laptop,
  crib: Baby,
  // Kitchen
  kitchen: Utensils,
  cooking: CookingPot,
  coffee: Coffee,
  fridge: Refrigerator,
  // Good to know
  'check-in': KeyRound,
  'check-out': LogOut,
  calendar: CalendarDays,
  clock: Clock,
  quiet: Moon,
  rules: ScrollText,
  age: IdCard,
  door: DoorOpen,
  info: Info,
  // UI
  pin: MapPin,
  mail: Mail,
  phone: Phone,
  instagram: Instagram,
  menu: Menu,
  x: X,
  plus: Plus,
  check: Check,
  star: Star,
  images: Images,
  'arrow-right': ArrowRight,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
} satisfies Record<string, LucideIcon | ((p: SvgProps) => ReactNode)>

export type IconName = keyof typeof icons
/** Names offered in the Pages CMS amenity icon dropdown. Keep .pages.yml in step with this list. */
export const iconNames = Object.keys(icons) as IconName[]

export function Icon({ name, className = 'icon' }: { name: IconName | string; className?: string }) {
  if (name === 'sparkle') return <Sparkle className={className} />
  const Cmp = (icons as Record<string, LucideIcon | ((p: SvgProps) => ReactNode)>)[name]
  if (!Cmp) return <Sparkle className={className} />
  return <Cmp className={className} strokeWidth={2} aria-hidden="true" />
}
