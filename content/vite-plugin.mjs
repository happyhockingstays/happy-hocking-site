// Vite plugin for the YAML content in /content (edited in Pages CMS).
//  - `virtual:content` exports site settings, policies, page copy, published reviews, blog post
//    summaries and a card-sized summary of every visible cabin.
//  - Each content/blog/*.md file becomes a module exporting the post's HTML (loaded per post).
//  - Each content/cabins/*.yml file becomes a module exporting the full cabin (loaded per page, so
//    galleries and long copy are code-split and never land in the shared bundle).
// A hidden cabin (hidden: true) is left out of the summaries, so no page or card is built for it.
import path from 'node:path'
import {
  BLOG_DIR,
  CABINS_DIR,
  CONTENT_DIR,
  cabinSummary,
  listCabinFiles,
  listPostFiles,
  loadCabins,
  loadPages,
  loadPolicies,
  loadPosts,
  loadReviews,
  loadSettings,
  readCabin,
  readPost,
  renderPost,
} from './lib.mjs'

const VIRTUAL = 'virtual:content'
const RESOLVED = '\0' + VIRTUAL

export default function contentPlugin() {
  return {
    name: 'happy-hocking-content',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED
    },
    load(id) {
      if (id === RESOLVED) {
        this.addWatchFile(CONTENT_DIR)
        for (const f of listCabinFiles()) this.addWatchFile(f)
        for (const f of listPostFiles()) this.addWatchFile(f)
        const data = {
          settings: loadSettings(),
          policies: loadPolicies(),
          pages: loadPages(),
          reviews: loadReviews(),
          // Draft posts show only while the site is still blocked from search engines (before launch).
          posts: loadPosts({ includeDrafts: !(process.env.URL || '').includes('happyhocking.com') }),
          cabins: loadCabins().map(cabinSummary),
        }
        return `export default ${JSON.stringify(data)}`
      }
      const file = id.split('?')[0]
      if (file.endsWith('.md') && path.resolve(file).startsWith(BLOG_DIR)) {
        return `export default ${JSON.stringify(renderPost(readPost(file).body))}`
      }
      if (file.endsWith('.yml') && path.resolve(file).startsWith(CABINS_DIR)) {
        return `export default ${JSON.stringify(readCabin(file))}`
      }
    },
    handleHotUpdate(ctx) {
      if (ctx.file.startsWith(CONTENT_DIR)) {
        const mod = ctx.server.moduleGraph.getModuleById(RESOLVED)
        if (mod) ctx.server.moduleGraph.invalidateModule(mod)
        ctx.server.ws.send({ type: 'full-reload' })
      }
    },
  }
}
