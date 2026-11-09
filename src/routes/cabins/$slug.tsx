import { createFileRoute, notFound } from '@tanstack/react-router'
import { CabinPage } from '@/pages/CabinPage'
import { loadCabin, policies } from '@/lib/content'
import { breadcrumbJsonLd, cabinJsonLd, faqJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/cabins/$slug')({
  loader: async ({ params }) => {
    const cabin = await loadCabin(params.slug)
    if (!cabin) throw notFound()
    return { cabin }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const c = loaderData.cabin
    return seo({
      // Page title pattern from the brand guide: cabin name, signature feature and "Hocking Hills", 60 characters max.
      title: c.seoTitle || `${c.name}: Hocking Hills cabin in ${c.town}, Ohio`,
      description: c.seoDescription || c.blurb,
      path: `/cabins/${c.slug}`,
      image: c.heroImage || undefined,
      jsonLd: [
        cabinJsonLd(c, policies),
        breadcrumbJsonLd([
          { name: 'Cabins', path: '/cabins' },
          { name: c.name, path: `/cabins/${c.slug}` },
        ]),
        ...(c.faqs.length ? [faqJsonLd(c.faqs)] : []),
      ],
    })
  },
  component: CabinRoute,
})

function CabinRoute() {
  const { cabin } = Route.useLoaderData()
  return <CabinPage key={cabin.slug} cabin={cabin} />
}
