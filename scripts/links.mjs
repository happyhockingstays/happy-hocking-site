// Checks the links in the built site. Run after a build: npm run build && npm run links
//  1. Broken links: every link to a page or photo on this site has to exist.
//  2. One anchor, one page: the same link wording in the body of a post or page never points at
//     2 different pages (the keyword plan's rule). Menus, buttons and cabin cards aren't counted.
//  3. Orphans: every page in the sitemap is linked from the body of at least 1 other page,
//     or from the menu or footer.
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'node-html-parser'

const ROOT = 'dist/client'
if (!fs.existsSync(ROOT)) {
  console.log('Build the site first: npm run build')
  process.exit(1)
}
const files = []
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') && files.push(path.join(d, e.name))))
walk(ROOT)
const pageOf = (f) => '/' + path.relative(ROOT, f).replace(/\\/g, '/').replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '')
const exists = (href) => {
  const p = decodeURI(href.split('#')[0].split('?')[0]).replace(/\/$/, '') || '/'
  if (p === '/') return true
  return fs.existsSync(path.join(ROOT, p)) || fs.existsSync(path.join(ROOT, `${p}.html`)) || fs.existsSync(path.join(ROOT, p, 'index.html'))
}
const redirects = fs.existsSync(path.join(ROOT, '_redirects')) ? fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8') : ''
const redirected = (href) => new RegExp(`^${href.split('?')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s`, 'm').test(redirects)

const problems = []
const anchors = new Map() // wording -> Map(url -> pages)
const inbound = new Map() // url -> Set(pages)
for (const f of files) {
  const page = pageOf(f)
  if (page === '/__forms') continue
  const doc = parse(fs.readFileSync(f, 'utf8'))
  for (const a of doc.querySelectorAll('a[href], img[src]')) {
    const href = a.getAttribute('href') || a.getAttribute('src') || ''
    if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/.netlify/')) continue
    if (!exists(href) && !redirected(href)) problems.push(`${page}: broken link to ${href}`)
    if (a.tagName !== 'A') continue
    const url = href.split('#')[0].replace(/\/$/, '') || '/'
    if (url !== page) (inbound.get(url) || inbound.set(url, new Set()).get(url)).add(page)
    // Body links only: inside a post, or a text link in page copy
    const inBody = a.closest('.post-body') || /\btext-link\b/.test(a.getAttribute('class') || '')
    const text = a.text.replace(/\s+/g, ' ').trim().toLowerCase()
    if (!inBody || !text || /^\/images\//.test(url) || a.closest('nav')) continue
    const m = anchors.get(text) || anchors.set(text, new Map()).get(text)
    ;(m.get(url) || m.set(url, new Set()).get(url)).add(page)
  }
}
// Calls to action that are allowed to point at more than 1 page
const GENERIC = /^(all cabins|all posts|read the owner faqs|see all|read more)$/
for (const [text, urls] of anchors) if (urls.size > 1 && !GENERIC.test(text)) problems.push(`"${text}" links to ${urls.size} pages: ${[...urls.keys()].join(', ')}`)

const sitemap = fs.existsSync(path.join(ROOT, 'sitemap.xml')) ? [...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1].replace(/\/$/, '') || '/') : []
for (const p of sitemap) if (p !== '/' && !(inbound.get(p) || new Set()).size) problems.push(`${p}: no page links to it`)

if (problems.length) {
  console.log(`${problems.length} link problem(s):\n` + problems.map((p) => '  - ' + p).join('\n'))
  process.exit(1)
}
console.log(`Link check passed: ${files.length} pages, ${anchors.size} body link wordings, no broken links, no wording that points at 2 pages, no orphans.`)
