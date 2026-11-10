import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/pages/HomePage'
import { pages } from '@/lib/content'
import { orgJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: 'Happy Hocking Stays: Hocking Hills cabins with pools and hot tubs',
      description: 'A place for everyone in the Hocking Hills. Private cabins with pools and hot tubs for groups of 6 to 29. Book direct and skip the booking-site service fees.',
      path: '/',
      image: pages.home.hero.image || undefined,
      jsonLd: orgJsonLd(),
    }),
  component: HomePage,
})
