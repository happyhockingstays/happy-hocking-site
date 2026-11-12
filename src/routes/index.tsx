import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/pages/HomePage'
import { pages } from '@/lib/content'
import { orgJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: 'Cabins in Hocking Hills with pools | Happy Hocking Stays',
      description: 'Cabins in Hocking Hills, Ohio for groups of 6 to 29. All our Hocking Hills cabins have a private pool and hot tub. Book direct and skip the booking-site fees.',
      path: '/',
      image: pages.home.hero.image || undefined,
      jsonLd: orgJsonLd(),
    }),
  component: HomePage,
})
