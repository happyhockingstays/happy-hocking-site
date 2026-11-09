import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/StubPage'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/blog/')({
  head: () => seo({ title: 'Hocking Hills travel blog | Happy Hocking Stays', description: 'Seasonal guides and trip ideas for the Hocking Hills, from the hosts at Happy Hocking Stays.', path: '/blog' }),
  component: () => <StubPage eyebrow="Blog" title="Hocking Hills trip ideas" note="The blog index and post template are step 8 of the first pass." />,
})
