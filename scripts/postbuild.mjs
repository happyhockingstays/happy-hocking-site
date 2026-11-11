// Runs after `vite build`.
//  1. Tidies the sitemap: drops trailing-slash duplicates, in-page links (#...), the private
//     review form and draft blog posts.
//  2. Writes the redirects file from docs/redirects.csv: every page of the old Wix site
//     (hockinghills-cabinrentals.com) points to its new home, and happyhockingstays.com
//     forwards to happyhocking.com. The rules only match those domains, so they do nothing
//     until the domains are added to the Netlify site at launch.
import fs from 'node:fs'
import { loadPosts } from '../content/lib.mjs'

const SITE = 'https://happyhocking.com'
const OLD_HOSTS = ['www.hockinghills-cabinrentals.com', 'hockinghills-cabinrentals.com']
const FORWARD_HOSTS = ['www.happyhockingstays.com', 'happyhockingstays.com']
// The old co-hosting site (Squarespace). Every page goes to the co-hosting page once the domain points at Netlify
const COHOST_HOSTS = ['hockinghills-hosting.com', 'www.hockinghills-hosting.com']
const PRIVATE = ['/review']

/* ---------- sitemap ---------- */
const all = loadPosts({ includeDrafts: true })
const drafts = new Set(all.filter((p) => p.draft).map((p) => `/blog/${p.slug}`))
const live = new Set(all.filter((p) => !p.draft).map((p) => `/blog/${p.slug}`))
const file = 'dist/client/sitemap.xml'
const xml = fs.readFileSync(file, 'utf8')
const out = xml.replace(/\s*<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g, (block, loc) => {
  if (loc.includes('#')) return ''
  const p = new URL(loc).pathname
  if (p !== '/' && p.endsWith('/')) return ''
  if (PRIVATE.includes(p) || drafts.has(p)) return ''
  return block
})
fs.writeFileSync(file, out)
console.log(`[postbuild] sitemap: ${(out.match(/<loc>/g) || []).length} URLs`)

/* ---------- redirects ---------- */
const rows = fs
  .readFileSync('docs/redirects.csv', 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => {
    const [from, to, kind] = line.split(',')
    return { from: from.trim(), to: to.trim(), kind: (kind || '').trim() }
  })
  .filter((r) => r.from && r.to)

const lines = ['# Built from docs/redirects.csv by scripts/postbuild.mjs. Edit the CSV, not this file.', '']
let waiting = 0
for (const r of rows) {
  // A post that hasn't been moved over yet goes to the blog index for now, as a temporary (302)
  // redirect so search engines keep checking. It becomes a permanent 301 once the post exists.
  const pending = r.kind === 'post' && !live.has(r.to)
  if (pending) waiting++
  const target = SITE + (pending ? '/blog' : r.to)
  const status = pending ? '302!' : '301!'
  for (const host of OLD_HOSTS) for (const scheme of ['https', 'http']) lines.push(`${scheme}://${host}${r.from}  ${target}  ${status}`)
}
lines.push('', '# Anything else on the old site goes to the new homepage')
for (const host of OLD_HOSTS) for (const scheme of ['https', 'http']) lines.push(`${scheme}://${host}/*  ${SITE}/  301!`)
lines.push('', '# happyhockingstays.com forwards to happyhocking.com, keeping the page')
for (const host of FORWARD_HOSTS) for (const scheme of ['https', 'http']) lines.push(`${scheme}://${host}/*  ${SITE}/:splat  301!`)
lines.push('', '# The old co-hosting site goes to the co-hosting page')
for (const host of COHOST_HOSTS) for (const scheme of ['https', 'http']) lines.push(`${scheme}://${host}/*  ${SITE}/co-hosting  301!`)
fs.writeFileSync('dist/client/_redirects', lines.join('\n') + '\n')
console.log(`[postbuild] redirects: ${rows.length} old URLs mapped${waiting ? `, ${waiting} blog posts waiting to be moved over` : ''}`)
