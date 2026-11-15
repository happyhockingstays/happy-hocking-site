// Checks blog posts against the keyword plan. Run: npm run posts            (every post)
//                                                 npm run posts -- ash-cave (one post)
// Each post's seed and supporting terms are in docs/blog-seeds.csv (add a row when a post is written).
// Errors make it fail. Notes are worth a look but may be fine: say why in the pull request.
import fs from 'node:fs'
import { parse } from 'yaml'

const only = process.argv.slice(2)
const plan = fs
  .readFileSync('docs/blog-seeds.csv', 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((l) => {
    const m = l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'))
    return { slug: m[0], id: m[1], seed: m[2], supporting: (m[3] || '').split(';').map((s) => s.trim()).filter(Boolean) }
  })

// Compare words only: lowercase, apostrophes and punctuation dropped, "pickle-ball" same as "pickle ball"
const norm = (s) => ` ${String(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()} `
// A seed still counts with a small joining word inside it: "large group cabin rentals in Ohio"
// matches the seed "large group cabin rentals ohio" (the on-page pass of Nov 12 used these).
const JOIN = '(?: (?:in|the|a|an|of|for|to|near|at|with))?'
const occurrences = (text, phrase) => {
  const words = norm(phrase).trim().split(' ')
  return (norm(text).match(new RegExp(`(?<= )${words.join(`${JOIN} `)}(?= )`, 'g')) || []).length
}

let errors = 0
for (const row of plan) {
  if (only.length && !only.includes(row.slug)) continue
  const file = `content/blog/${row.slug}.md`
  if (!fs.existsSync(file)) {
    console.log(`\n${row.slug}: no file yet`)
    continue
  }
  const [, front, body] = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(fs.readFileSync(file, 'utf8'))
  const meta = parse(front)
  const faqs = meta.faqs || []
  const text = body.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\]\([^)]*\)/g, ']')
  const faqText = faqs.map((f) => `${f.q} ${f.a}`).join(' ')
  const words = (`${meta.title} ${meta.description} ${text} ${faqText}`.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) || []).length
  const h2 = text.split('\n').filter((l) => /^## /.test(l)).map((l) => l.slice(3))
  const firstPara = text.trim().split(/\n\s*\n/)[0]
  // The title and the summary are on the page too (the H1 and the lead under it)
  const seedN = occurrences(`${meta.title} ${meta.description} ${text} ${faqText}`, row.seed)
  const density = (100 * seedN * row.seed.split(/\s+/).length) / words
  const err = []
  const note = []
  const gTitle = meta.seoTitle || `${meta.title} | Happy Hocking Stays`
  if (gTitle.length > 60) err.push(`Google title is ${gTitle.length} characters (60 max)`)
  if (!occurrences(gTitle, row.seed)) err.push('seed is not in the Google title')
  if (!occurrences(meta.title, row.seed)) err.push('seed is not in the title (H1)')
  if (!meta.description || meta.description.length < 120 || meta.description.length > 165) err.push(`summary is ${(meta.description || '').length} characters (120 to 165)`)
  if (!occurrences(meta.description || '', row.seed)) err.push('seed is not in the summary')
  if (!occurrences(firstPara, row.seed)) err.push('seed is not in the first paragraph')
  const withSeed = h2.filter((h) => occurrences(h, row.seed)).length
  if (!withSeed) err.push('seed is in no H2')
  if (h2.length && withSeed / h2.length > 0.75) note.push(`seed is in ${withSeed} of ${h2.length} H2s (leave it out of a quarter of them)`)
  if (density < 1.2 || density > 2.5) note.push(`seed density is ${density.toFixed(2)}% (aim for 1.2% to 2%)`)
  if (words < 1200 || words > 2200) note.push(`${words} words (1,200 to 2,000 is the usual range)`)
  for (const s of row.supporting) if (!occurrences(`${meta.title} ${meta.description} ${text} ${faqText}`, s)) note.push(`supporting term not used: "${s}"`)
  if (faqs.length < 3 || faqs.length > 7) err.push(`${faqs.length} questions (3 to 7)`)
  for (const f of faqs) {
    const n = String(f.a).split(/\s+/).filter(Boolean).length
    if (n < 40 || n > 70) err.push(`answer to "${f.q}" is ${n} words (40 to 70)`)
    if (/airbnb|vrbo/i.test(f.q)) err.push(`question names Airbnb or Vrbo: "${f.q}"`)
  }
  for (const h of text.split('\n').filter((l) => /^#{2,4} /.test(l))) if (/airbnb|vrbo/i.test(h)) err.push(`heading names Airbnb or Vrbo: "${h}"`)
  const links = [...body.matchAll(/(?<!!)\[[^\]]+\]\((\/(?!images\/)[^)]*)\)/g)].map((m) => m[1])
  if (links.length < 3) note.push(`only ${links.length} internal links`)
  if (!links.some((l) => l.startsWith('/cabins') || l.startsWith('/hocking-hills-'))) err.push('no link to a cabin, the Cabins page or a collection page')
  if (/[—–]/.test(body) || /[—–]/.test(front)) err.push('has an em or en dash')
  if (/!(?!\[)/.test(text)) note.push('has an exclamation mark')
  errors += err.length
  console.log(`\n${row.slug} (${row.id}) · seed "${row.seed}" · ${words} words · ${seedN} seed mentions, ${density.toFixed(2)}% · ${h2.length} H2s · ${faqs.length} questions · ${links.length} internal links`)
  for (const e of err) console.log(`  ERROR ${e}`)
  for (const n of note) console.log(`  note  ${n}`)
}
if (errors) {
  console.log(`\n${errors} error(s)`)
  process.exit(1)
}
console.log('\nPost check passed.')
