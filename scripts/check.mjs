// Checks the brand copy rules across /content and /src. Run after any copy change: npm run check
// It catches the rules that are easy to break by accident. It doesn't replace reading the copy.
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

const problems = []
const flag = (where, msg) => problems.push(`${where}: ${msg}`)

const BANNED = ['nestled', 'tucked away', 'hidden gem', 'oasis', 'boasts', 'breathtaking', 'stunning', 'luxurious amenities', 'home away from home', 'hustle and bustle', 'unforgettable memories', 'perfect getaway', 'look no further', 'elevate', 'curated', 'seamless', 'platform fees']
const SPELLING = [
  [/\bwi-?fi\b/i, 'Wi-Fi'],
  [/\bfirepit\b/i, 'fire pit'],
  [/\bhottub\b/i, 'hot tub'],
  [/\bgameroom\b/i, 'game room'],
  [/\bcheckin\b/i, 'check-in'],
  [/\bco ?host(ing)?\b/i, 'co-host'],
  [/\bRickenbacher\b/i, 'Rickenbacker'],
  [/\bCloud's Reach\b|\bCloudsreach\b/i, 'Clouds Reach'],
  [/\bHawking Hills\b/i, 'Hocking Hills'],
]
const HEATED_OK = ['clouds-reach', 'rickenbacker-ridge']

function checkText(where, text, { cabin } = {}) {
  if (typeof text !== 'string' || !text) return
  if (/[—–]/.test(text)) flag(where, 'has an em or en dash. Use a comma, a colon or a new sentence')
  // Real business names that happen to contain a banned word
  const low = text.toLowerCase().replace(/oasis coffee shop/g, '')
  for (const w of BANNED) if (low.includes(w)) flag(where, `uses "${w}"`)
  for (const [re, right, okRe] of SPELLING) {
    const m = text.match(new RegExp(re.source, re.flags.includes('i') ? 'gi' : 'g')) || []
    for (const hit of m) if (!(okRe && okRe.test(hit)) && hit !== right) flag(where, `write "${right}", not "${hit}"`)
  }
  if (/\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/i.test(text.replace(/three-seasons/gi, ''))) flag(where, 'spells out a number. Use numerals (sleeps 8, 3 bedrooms)')
  if (/\b(nine|9|all nine|all 9) (cabins|homes)\b/i.test(text) || /\bour (nine|9)\b/i.test(text)) flag(where, 'states how many cabins we have')
  // "a, b, and c". A place name ("Logan, Ohio, and") or a joined sentence ("x and y, and z") isn't one.
  if (text.replace(/, Ohio,/g, '').split(/[.;:!?]/).some((s) => /\w+, (?:(?! and | or )[^,])+, (and|or) /.test(s))) flag(where, 'looks like a serial comma ("a, b, and c")')
  if (/\d ?(AM|PM)\b/.test(text) || /(?<![:\d])\b\d{1,2} ?(am|pm)\b/.test(text)) flag(where, 'time format should be 4:00 pm')
  if (/\p{Extended_Pictographic}/u.test(text.replace(/[©®™✦]/g, ''))) flag(where, 'has an emoji')
  if (/\bown a (vacation )?home\?/i.test(text)) flag(where, 'says "Own a home?". Use "Looking for a co-host?"')
  if (cabin && !HEATED_OK.includes(cabin) && /heated/i.test(text.replace(/(not|isn't|is not) heated/gi, '').replace(/Is the pool heated\?/gi, ''))) flag(where, 'says "heated", but only Clouds Reach and Rickenbacker Ridge have heated pools')
}

const noPeriod = (where, text) => {
  if (typeof text === 'string' && /\.$/.test(text.trim())) flag(where, `ends with a period: "${text}"`)
}

function walk(where, value, opts) {
  if (typeof value === 'string') checkText(where, value, opts)
  else if (Array.isArray(value)) value.forEach((v, i) => walk(`${where}[${i + 1}]`, v, opts))
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) if (!['bookingWidget', 'searchWidget', 'image', 'heroImage', 'icon', 'similar', 'cabin', 'email'].includes(k)) walk(`${where}.${k}`, v, opts)
}

/* ---------- cabins ---------- */
const dir = 'content/cabins'
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.yml'))) {
  const slug = f.replace('.yml', '')
  const c = parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  const w = `cabins/${slug}`
  walk(w, c, { cabin: slug })
  for (const k of ['name', 'shortName', 'tagline', 'poolSeason', 'quietHours', 'checkOut']) noPeriod(`${w}.${k}`, c[k])
  ;(c.chips || []).forEach((x) => noPeriod(`${w}.chips`, x))
  ;(c.extraRules || []).forEach((x) => noPeriod(`${w}.extraRules`, x))
  ;(c.goodToKnow || []).forEach((x) => noPeriod(`${w}.goodToKnow`, x))
  ;(c.highlights || []).forEach((h) => noPeriod(`${w}.highlights.title`, h.title))
  ;(c.rooms || []).forEach((r) => ['name', 'floor', 'beds', 'note'].forEach((k) => noPeriod(`${w}.rooms.${k}`, r[k])))
  ;(c.amenities || []).forEach((g) => (g.items || []).forEach((i) => noPeriod(`${w}.amenities`, i.label)))
  ;(c.gallery || []).forEach((g) => (g.images || []).forEach((i) => noPeriod(`${w}.gallery caption`, i.caption)))
  if (c.seoTitle && c.seoTitle.length > 60) flag(`${w}.seoTitle`, `${c.seoTitle.length} characters (60 max)`)
  if (c.seoDescription && (c.seoDescription.length < 120 || c.seoDescription.length > 165)) flag(`${w}.seoDescription`, `${c.seoDescription.length} characters (120 to 165)`)
  if (c.tagline && !/^A place to /.test(c.tagline)) flag(`${w}.tagline`, 'should start with "A place to"')
  if (!c.poolSeason) flag(`${w}.poolSeason`, 'is empty. Pools are seasonal: always give the dates')
  const sleeps = (c.rooms || []).reduce((s, r) => s + (Number(r.sleeps) || 0), 0)
  if (c.rooms?.length && sleeps !== c.sleeps) flag(`${w}.rooms`, `rooms add up to ${sleeps} guests, but the cabin sleeps ${c.sleeps}`)
  for (const i of [c.heroImage, ...(c.keyShots || []).map((s) => s.image), ...(c.highlights || []).map((s) => s.image), ...(c.rooms || []).map((s) => s.image), ...(c.gallery || []).flatMap((g) => g.images.map((x) => x.image))]) {
    if (i && !fs.existsSync(path.join('public', i))) flag(w, `photo not found: ${i}`)
  }
  for (const g of c.gallery || []) for (const i of g.images) if (!i.alt) flag(`${w}.gallery`, `no description (alt text) for ${i.image}`)
}

/* ---------- settings and reviews ---------- */
for (const f of ['content/settings/site.yml', 'content/settings/policies.yml']) walk(f.replace('content/', ''), parse(fs.readFileSync(f, 'utf8')))
noPeriod('settings/site.banner.text', parse(fs.readFileSync('content/settings/site.yml', 'utf8')).banner?.text)
for (const r of parse(fs.readFileSync('content/settings/policies.yml', 'utf8')).houseRules || []) noPeriod('settings/policies.houseRules', r)

/* ---------- pages: Home, Co-hosting, About, FAQs ---------- */
const HEADLINE_KEYS = ['eyebrow', 'heading', 'title', 'linkLabel', 'replyTime']
function walkPage(where, value, key = '') {
  if (typeof value === 'string') {
    checkText(where, value)
    if (HEADLINE_KEYS.includes(key)) noPeriod(where, value)
    // "heated" is true for 2 pools only, so the sentence has to name them
    for (const sentence of value.split(/(?<=[.!?])\s+/)) if (/heated/i.test(sentence) && !/Clouds Reach|Rickenbacker Ridge/.test(sentence)) flag(where, 'says "heated" without naming Clouds Reach or Rickenbacker Ridge')
  } else if (Array.isArray(value)) value.forEach((v, i) => walkPage(`${where}[${i + 1}]`, v, key))
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) if (!['image', 'photo', 'video', 'videoPhone', 'icon'].includes(k)) walkPage(`${where}.${k}`, v, k)
}
const pagesDir = 'content/pages'
for (const f of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.yml'))) {
  const page = parse(fs.readFileSync(path.join(pagesDir, f), 'utf8')) || {}
  const w = `pages/${f.replace('.yml', '')}`
  walkPage(w, page)
  for (const x of page.cohost?.points || []) noPeriod(`${w}.cohost.points`, x)
  if (page.hero?.lead && f === 'home.yml') noPeriod(`${w}.hero.lead`, page.hero.lead)
  for (const v of [page.hero?.video, page.hero?.videoPhone]) if (v && !fs.existsSync(path.join('public', v))) flag(w, `video not found: ${v}`)
  for (const key of ['hero', 'story', 'cohost', 'area']) {
    const i = page[key]?.image
    if (i && !fs.existsSync(path.join('public', i))) flag(w, `photo not found: ${i}`)
    if (i && !page[key]?.alt) flag(`${w}.${key}`, 'photo has no description (alt text)')
  }
}

/* ---------- blog posts ---------- */
const blogDir = 'content/blog'
for (const f of fs.existsSync(blogDir) ? fs.readdirSync(blogDir).filter((f) => f.endsWith('.md')) : []) {
  const raw = fs.readFileSync(path.join(blogDir, f), 'utf8')
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  const w = `blog/${f.replace('.md', '')}`
  if (!m) {
    flag(w, 'is missing its settings block')
    continue
  }
  const meta = parse(m[1]) || {}
  // Check the words, not the web addresses inside links and photos
  const words = m[2].replace(/\]\([^)]*\)/g, ']').replace(/https?:\/\/\S+/g, '')
  checkText(`${w} (title)`, meta.title)
  checkText(`${w} (summary)`, meta.description)
  checkText(w, words)
  noPeriod(`${w} (title)`, meta.title)
  for (const line of words.split('\n')) if (/^#{1,6}\s/.test(line)) noPeriod(`${w} heading`, line.replace(/^#+\s*/, ''))
  if (!/^[a-z0-9-]+\.md$/.test(f)) flag(w, 'file name should be lowercase letters, numbers and hyphens')
  if (!meta.draft) {
    if (!meta.description || meta.description.length < 120 || meta.description.length > 165) flag(`${w} (summary)`, `${(meta.description || '').length} characters (120 to 165)`)
    if (meta.seoTitle && meta.seoTitle.length > 60) flag(`${w} (Google title)`, `${meta.seoTitle.length} characters (60 max)`)
    if (!meta.cover) flag(w, 'has no cover photo')
    if (meta.cover && !meta.coverAlt) flag(w, 'cover photo has no description (alt text)')
  }
  if (meta.cover && !fs.existsSync(path.join('public', meta.cover))) flag(w, `cover photo not found: ${meta.cover}`)
}

/* ---------- page code: dashes, banned words and cabin counts in the visible copy ---------- */
const srcFiles = []
const collect = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? collect(path.join(d, e.name)) : /\.tsx$/.test(e.name) && srcFiles.push(path.join(d, e.name))))
collect('src')
for (const f of srcFiles) {
  const code = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  if (/[—–]/.test(code)) flag(f, 'has an em or en dash')
  for (const w of BANNED) if (code.toLowerCase().includes(w)) flag(f, `uses "${w}"`)
  if (/\b(nine|9) (cabins|homes)\b/i.test(code)) flag(f, 'states how many cabins we have')
  if (/\bown a (vacation )?home( here)?\?/i.test(code.replace(/never "Own a home\?"/g, ''))) flag(f, 'says "Own a home?". Use "Looking for a co-host?"')
}

if (problems.length) {
  console.log(`${problems.length} copy problem(s):\n` + problems.map((p) => '  - ' + p).join('\n'))
  process.exit(1)
}
console.log('Copy check passed: cabins, pages, blog posts, settings and page code follow the brand copy rules.')
