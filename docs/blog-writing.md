# Writing new blog posts

How the Wave 1 posts (and any later ones) are researched, written, linked and shipped. It's Cole's SEO blog playbook, fitted to this site. Where the 2 differ, the brand rules in `AGENTS.md` win.

## Before writing

1. Take the post's row from the IA (Cole's Quadratic file, or the export he attaches): Page ID, title, URL, seed, supporting terms and body terms. Write nothing that isn't on the map.
2. Read what ranks for the seed, for structure and gaps only. Never copy framing or wording.
3. Get every fact from a primary source: Ohio Department of Natural Resources pages for state parks, forests and nature preserves, the park or venue's own site, the county or city. A fact with no source stays out. Competitors (other cabin companies, booking sites) are never sources and are never linked.
4. Our own cabins are the only lodging a post recommends. Facts about a cabin come from its file in `content/cabins`.

## The post

- **File:** `content/blog/<slug>.md`, where the slug is the IA's URL (the seed, no year).
- **Length:** 1,200 to 2,000 words for most posts.
- **Title:** the seed at the front, sentence case, no period. `seoTitle` is 60 characters at most.
- **Summary (`description`):** 120 to 165 characters, the seed near the front. It's also the lead under the title.
- **First paragraph:** the seed in the first sentence, and the question answered in about 40 to 60 words.
- **H2s:** the seed in one H2 near the top, and left out of at least a quarter of them. Each H2 says what follows.
- **Supporting terms:** each appears as an exact phrase at least once. Questions under the post count. A term that can't be placed naturally is left out and noted in the pull request.
- **Density:** 1.2% to 2% for the seed on this site (the playbook's 2% to 3% reads stuffed in Natalie's voice). A place name such as Ash Cave runs higher, up to about 3%, because there's no other way to say it.
- **The copy check reads some commas as serial commas.** "a, b, and c" is the rule it's after, but a sentence like "x, rated easy, and y" trips it too. Split the sentence.
- **Questions (`faqs`):** 4 to 6, each answered in 40 to 70 words, the first sentence repeating the key term. Plain text, no links. Don't repeat a question another post answers.
- **Cover:** one of the clients' own cabin photos, with alt text. No stock photos, and no photos of parks we don't own.
- **Voice:** a host who knows the area, talking to a friend. "You" and "we", contractions, plain words, paragraphs of 1 to 3 sentences. No em dashes, no exclamation-mark hype, no bold inside paragraphs and none of the banned words.
- **Brand rules that bite in posts:** numerals for every number, no serial comma, 4:00 pm, never the number of cabins, pool dates whenever a pool comes up, "heated" only for Clouds Reach and Rickenbacker Ridge, no pets, no parties or events, and Airbnb or Vrbo only in body copy.

## Links

- **Up:** every post links to its cluster's hub (a collection page or `/cabins`) and to at least 1 cabin page that fits the topic.
- **Across:** 1 or 2 links to sibling posts that help the reader.
- **Wording:** the target page's seed, exactly. Cabin names link to cabin pages. One wording never points at 2 pages.
- **Planned pages:** write the seed unlinked. `npm run links` won't flag it, so search the posts for the seed when that page ships.
- **Back links:** each new post's pull request turns 2 or 3 mentions in older posts into links to it. Swap words, don't add sentences, and don't change an older post's `updated` date for a link alone.
- **Outside links:** 3 to 6 per post, to official pages (the park, the trail, the venue), first mention only.

## Shipping

1. Add the post's row to `docs/blog-seeds.csv` (slug, Page ID, seed, supporting terms), then run `npm run posts -- <slug>`. It checks seed placement, density, each supporting term, the questions and the links. Errors have to be fixed. Notes get fixed or explained in the pull request.
2. `npm run check`, `npm run typecheck`, `npm run build`, then `npm run links`.
3. `python3 scripts/make-share-images.py` for the new post's share image.
4. The pull request lists, for each post: the seed and its density, where each supporting term went, links added in both directions, a sources table (fact, source, link, date checked) and any judgment calls.
5. When it merges, mark the page Done on the IA's Cluster map and republish Lookout.
