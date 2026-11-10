import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '@/pages/ContactPage'
import { breadcrumbJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () =>
    seo({
      title: 'Contact Happy Hocking Stays | Hocking Hills cabins',
      description: 'Questions about a stay or about co-hosting your Hocking Hills vacation home? Send a note, call or email. We typically reply within an hour.',
      path: '/contact',
      jsonLd: breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }]),
    }),
  component: ContactPage,
})
