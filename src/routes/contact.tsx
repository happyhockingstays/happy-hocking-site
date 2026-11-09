import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/StubPage'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () => seo({ title: 'Contact | Happy Hocking Stays', description: 'Questions about a stay or about co-hosting your Hocking Hills vacation home? Send the Happy Hocking Stays team a message.', path: '/contact' }),
  component: () => <StubPage eyebrow="Contact" title="Happy to help" note="The contact form, with a topic picker for stays and co-hosting, is step 6 of the first pass." />,
})
