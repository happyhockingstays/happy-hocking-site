import { createFileRoute } from '@tanstack/react-router'
import { FaqsPage } from '@/pages/FaqsPage'
import { pages } from '@/lib/content'
import { breadcrumbJsonLd, faqJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/faqs')({
  head: () => {
    const all = pages.faqs.groups.flatMap((g) => g.items)
    return seo({
      title: 'Hocking Hills cabin FAQs | Happy Hocking Stays',
      description: 'Answers about booking direct, pools and hot tubs, check-in, minimum stays, house rules and cancellations at our Hocking Hills cabins.',
      path: '/faqs',
      jsonLd: [breadcrumbJsonLd([{ name: 'FAQs', path: '/faqs' }]), ...(all.length ? [faqJsonLd(all)] : [])],
    })
  },
  component: FaqsPage,
})
