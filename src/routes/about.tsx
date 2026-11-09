import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/StubPage'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/about')({
  head: () => seo({ title: 'About us | Happy Hocking Stays', description: 'Happy Hocking Stays is a locally run vacation rental company in the Hocking Hills of Ohio. Meet the team behind the cabins.', path: '/about' }),
  component: () => <StubPage eyebrow="About" title="A place for everyone in the Hocking Hills" note="Our story and the team section are step 6 of the first pass. Waiting on the story and headshots." />,
})
