import { createFileRoute } from '@tanstack/react-router'
import { ReviewPage } from '@/pages/ReviewPage'
import { seo } from '@/lib/seo'

// Private page: reached only from the post-checkout message. noindex, and left out of the
// sitemap by scripts/postbuild.mjs. Don't link to it from the navigation.
export const Route = createFileRoute('/review')({
  head: () => seo({ title: 'Review your stay | Happy Hocking Stays', description: 'Tell us about your stay with Happy Hocking Stays.', path: '/review', noindex: true }),
  component: ReviewPage,
})
