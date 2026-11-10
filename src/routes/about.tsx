import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '@/pages/AboutPage'
import { breadcrumbJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/about')({
  head: () =>
    seo({
      title: 'About Happy Hocking Stays | Hocking Hills cabin hosts',
      description: 'Meet the local team behind Happy Hocking Stays: private Hocking Hills cabins with pools and hot tubs, and co-hosting for vacation homeowners.',
      path: '/about',
      jsonLd: breadcrumbJsonLd([{ name: 'About', path: '/about' }]),
    }),
  component: AboutPage,
})
