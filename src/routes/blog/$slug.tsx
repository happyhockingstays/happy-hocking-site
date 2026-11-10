import { createFileRoute, notFound } from '@tanstack/react-router'
import { BlogPostPage } from '@/pages/BlogPages'
import { loadPostBody, postBySlug } from '@/lib/content'
import { breadcrumbJsonLd, postJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = postBySlug(params.slug)
    const body = post ? await loadPostBody(params.slug) : undefined
    if (!post || !body) throw notFound()
    return { post, html: body.html }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const p = loaderData.post
    return seo({
      title: p.seoTitle || `${p.title} | Happy Hocking Stays`,
      description: p.description,
      path: `/blog/${p.slug}`,
      image: p.cover || undefined,
      noindex: p.draft,
      article: { published: p.date, modified: p.updated },
      jsonLd: [
        postJsonLd(p),
        breadcrumbJsonLd([
          { name: 'Blog', path: '/blog' },
          { name: p.title, path: `/blog/${p.slug}` },
        ]),
      ],
    })
  },
  component: PostRoute,
})

function PostRoute() {
  const { post, html } = Route.useLoaderData()
  return <BlogPostPage key={post.slug} post={post} html={html} />
}
