// Runs after `vite build`. Tidies the sitemap:
//  - drops trailing-slash duplicates (every canonical URL has no trailing slash)
//  - drops private pages that must stay out of search (the review form)
import fs from 'node:fs'

const PRIVATE = ['/review']
const file = 'dist/client/sitemap.xml'
const xml = fs.readFileSync(file, 'utf8')
const out = xml.replace(/\s*<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g, (block, loc) => {
  const p = new URL(loc).pathname
  if (p !== '/' && p.endsWith('/')) return ''
  if (PRIVATE.includes(p)) return ''
  return block
})
fs.writeFileSync(file, out)
console.log(`[postbuild] sitemap: ${(out.match(/<loc>/g) || []).length} URLs`)
