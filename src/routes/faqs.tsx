import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/StubPage'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/faqs')({
  head: () => seo({ title: 'FAQs | Happy Hocking Stays', description: 'Answers about booking direct, check-in, pools and hot tubs, house rules and cancellations at Happy Hocking Stays cabins in the Hocking Hills.', path: '/faqs' }),
  component: () => <StubPage eyebrow="FAQs" title="Happy to help" note="The FAQ page is step 6 of the first pass." />,
})
