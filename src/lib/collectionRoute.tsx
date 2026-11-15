import { notFound } from '@tanstack/react-router'
import { CollectionPage, collectionCabins } from '@/pages/CollectionPage'
import { collectionBySlug } from '@/lib/content'
import { breadcrumbJsonLd, cabinListJsonLd, faqJsonLd, seo } from '@/lib/seo'

/**
 * Route options shared by the cabin collection pages. Each page has a small file in src/routes
 * named for its web address (set by the keyword plan), and its words in content/collections.
 */
export function collectionRoute(slug: string) {
  const load = () => {
    const page = collectionBySlug(slug)
    if (!page) throw notFound()
    return page
  }
  return {
    head: () => {
      const p = collectionBySlug(slug)
      if (!p) return {}
      const path = `/${p.slug}`
      return seo({
        title: p.seoTitle || `${p.title} | Happy Hocking Stays`,
        description: p.seoDescription || p.lead,
        path,
        image: p.image || undefined,
        jsonLd: [
          cabinListJsonLd(p.title, path, collectionCabins(p).map((x) => x.cabin)),
          breadcrumbJsonLd([
            { name: 'Cabins', path: '/cabins' },
            { name: p.navLabel, path },
          ]),
          ...(p.faqs.length ? [faqJsonLd(p.faqs)] : []),
        ],
      })
    },
    component: () => <CollectionPage page={load()} />,
  }
}
