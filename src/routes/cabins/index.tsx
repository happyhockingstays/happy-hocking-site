import { createFileRoute } from '@tanstack/react-router'
import { CabinsPage } from '@/pages/CabinsPage'
import { breadcrumbJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/cabins/')({
  head: () =>
    seo({
      title: 'Hocking Hills cabin rentals with pools | Happy Hocking Stays',
      description: 'Hocking Hills cabin rentals for groups of 6 to 29, each with a private pool and hot tub. Compare our Hocking Hills lodging, check dates and book direct.',
      path: '/cabins',
      jsonLd: breadcrumbJsonLd([{ name: 'Cabins', path: '/cabins' }]),
    }),
  component: CabinsPage,
})
