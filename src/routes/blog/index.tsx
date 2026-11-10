import { createFileRoute } from '@tanstack/react-router'
import { BlogIndexPage } from '@/pages/BlogPages'
import { breadcrumbJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/blog/')({
  head: () =>
    seo({
      title: 'Hocking Hills guides and trip ideas | Happy Hocking Stays',
      description: 'Seasonal guides, trail picks and trip ideas for the Hocking Hills, from the hosts at Happy Hocking Stays. Plan your stay, then book direct.',
      path: '/blog',
      jsonLd: breadcrumbJsonLd([{ name: 'Blog', path: '/blog' }]),
    }),
  component: BlogIndexPage,
})
