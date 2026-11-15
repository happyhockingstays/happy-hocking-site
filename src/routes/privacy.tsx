import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { breadcrumbJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/privacy')({
  head: () =>
    seo({
      title: 'Privacy policy | Happy Hocking Stays',
      description: 'What information Happy Hocking Stays collects on happyhocking.com, how we use it, who we share it with and how to ask us to correct or delete it.',
      path: '/privacy',
      jsonLd: breadcrumbJsonLd([{ name: 'Privacy policy', path: '/privacy' }]),
    }),
  component: PrivacyPage,
})
