import { createFileRoute } from '@tanstack/react-router'
import { SearchPage } from '@/pages/SearchPage'
import { seo } from '@/lib/seo'

// Search results for the Hospitable search bar. noindex, and left out of the sitemap by
// scripts/postbuild.mjs: the results depend on the dates in the web address.
export const Route = createFileRoute('/search')({
  head: () => seo({ title: 'Cabins open for your dates | Happy Hocking Stays', description: 'See which Happy Hocking Stays cabins are open for your dates and book direct.', path: '/search', noindex: true }),
  component: SearchPage,
})
