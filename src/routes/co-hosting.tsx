import { createFileRoute } from '@tanstack/react-router'
import { CoHostingPage } from '@/pages/CoHostingPage'
import { pages } from '@/lib/content'
import { breadcrumbJsonLd, faqJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/co-hosting')({
  head: () =>
    seo({
      title: 'Hocking Hills property management | Happy Hocking Stays',
      description: 'Hocking Hills property management and co-hosting for vacation homes: guest messages, pricing, cleaning and upkeep, from the team behind our 4.9-star cabins.',
      path: '/co-hosting',
      image: pages.cohosting.hero.image || undefined,
      jsonLd: [breadcrumbJsonLd([{ name: 'Co-hosting', path: '/co-hosting' }]), ...(pages.cohosting.faqs.length ? [faqJsonLd(pages.cohosting.faqs)] : [])],
    }),
  component: CoHostingPage,
})
