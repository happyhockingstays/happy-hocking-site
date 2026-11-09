import { createFileRoute } from '@tanstack/react-router'
import { CabinsPage } from '@/pages/CabinsPage'
import { breadcrumbJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/cabins/')({
  head: () =>
    seo({
      title: 'Hocking Hills cabins with pools and hot tubs | Happy Hocking Stays',
      description: 'Private Hocking Hills cabins for groups of 6 to 29, each with a pool and hot tub. Check dates, pick your cabin and book direct to skip the booking-site service fees.',
      path: '/cabins',
      jsonLd: breadcrumbJsonLd([{ name: 'Cabins', path: '/cabins' }]),
    }),
  component: CabinsPage,
})
