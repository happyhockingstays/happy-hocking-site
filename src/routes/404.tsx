import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '@/components/NotFound'
import { seo } from '@/lib/seo'

// Prerendered to 404.html, which Netlify serves for any address that doesn't exist.
// Old Wix addresses that aren't in docs/redirects.csv land here too (the IA's rule: never the homepage).
// noindex, and left out of the sitemap by scripts/postbuild.mjs.
export const Route = createFileRoute('/404')({
  head: () => seo({ title: 'Page not found | Happy Hocking Stays', description: "The page you're looking for isn't here. The cabins still are.", path: '/404', noindex: true }),
  component: NotFound,
})
