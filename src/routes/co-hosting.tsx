import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/StubPage'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/co-hosting')({
  head: () => seo({ title: 'Hocking Hills co-hosting | Happy Hocking Stays', description: 'End-to-end co-hosting for Hocking Hills vacation homes: guest messages, pricing, cleaning and upkeep, from the team behind our 4.9-star cabins.', path: '/co-hosting' }),
  component: () => <StubPage eyebrow="Hocking Hills co-hosting" title="Happy homes start with great hosts" note="The co-hosting page, with its own owner contact form, is step 5 of the first pass." />,
})
