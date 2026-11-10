# Happy Hocking Stays: project knowledge

Read by Claude (via CLAUDE.md) and Cursor. **Start every new session with `HANDOFF.md`**: current status, what's next and open questions. Update `HANDOFF.md` before ending a session.

## What this is

The website for Happy Hocking Stays (happyhocking.com), a Hocking Hills, Ohio company that rents private cabins and co-hosts vacation homes for local owners. The site has two jobs: book stays direct, and win co-hosting clients. Every page makes one choice obvious in the first screen: book a stay, or get a co-host.

Built by Cole Stark (Stark Visibility) for Dave Hughes and Natalie Chadwell. Natalie owns voice, brand and content. The contracted scope is in the project's Website and SEO Services Agreement. Don't build past it without checking with Cole.

The full brand guide lives in the Claude project (`claude/happy-hocking-brand-guidelines.md`). The rules below are the ones that matter in code and copy.

## Three hard rules

1. **Never edit the Hospitable widget code.** Hospitable handles every booking. Each cabin's booking widget and the property search widget arrive as embed snippets and are pasted, unchanged, into Pages CMS (`bookingWidget` on a cabin, `searchWidget` in Site settings). `src/components/Booking.tsx` only injects them. Frame a widget in our own card, never restyle or rewrite what's inside it, and never build a custom booking or payment flow.
2. **Follow the copy rules** (next section) in every page, post, caption and alt text. Run `npm run check` after any copy change.
3. **Follow the photo rules** (below). Never commit a full-size original.

## Copy rules

The first two come straight from Natalie and are not up for debate.

1. **No periods at the end of headlines**, taglines, eyebrows, buttons, nav links, chips or captions. Body sentences keep normal punctuation. Question marks are fine ("Not quite right? Try another").
2. **Never state how many cabins there are.** Cabins come and go. Say "our cabins".
3. **No em dashes.** Use a comma, a colon or a new sentence.
4. **Sentence case** for headlines and buttons: "Check availability". Eyebrows are typed in sentence case; the design sets them in capitals.
5. **No serial comma:** "pools, hot tubs and game rooms".
6. **Numerals for every number:** sleeps 8, 3 bedrooms, 5 minutes, 4.9 stars, 85°F. Ranges use "to": 20 to 30 minutes.
7. **Times and dates:** 4:00 pm and 10:00 am; May 15 to October 15. Abbreviate months only in chips.
8. **No emoji.** Brand icons do that job (`src/components/Icon.tsx`).
9. About 30 words per block is the ceiling. Extra detail goes behind "Read more", "See all" or into FAQs.

**Voice:** a great host texting a friend. Warm, quick, a little playful, always specific. Lead with the feeling, prove it with a fact. "We" and "you", contractions, plain words. One wink per section is plenty.

**Approved lines, word for word:** A place for everyone in the Hocking Hills · Find your happy place · Happy guests, happy homes · Happy homes start with great hosts · Happy to help · Book direct and skip the booking-site service fees (short form: Skip the booking-site fees). Every cabin has an "A place to ___" tagline that matches its Airbnb listing and hero photo.

**Words:** "cabins" in navigation, titles, headlines and anything written for search. "Homes" is fine in body copy and is the word for owners. "Stay" is the trip. Avoid "units", "listings" and "properties" in guest copy. Write "co-host" and "co-hosting", "Looking for a co-host?" (never "Own a home?"), hot tub, fire pit, game room, pickleball, Wi-Fi, check-in.

**Names:** Happy Hocking Stays (casual: Happy Hocking; "Happy Hocking Stays, LLC" in legal lines only). Hocking Hills. Rickenbacker Ridge. Clouds Reach. Dunkle Creek. The Farm at Nickel Plate, then The Farm. Lazy Deer Retreat, then Lazy Deer. The Johnny (capital T).

**Never write:** nestled, tucked away, hidden gem, oasis, boasts, breathtaking, stunning, luxurious amenities, home away from home, escape the hustle and bustle, unforgettable memories, perfect getaway, look no further, elevate, curated, seamless, "whether you're... or...", "it's not just X, it's Y".

**Facts and claims:**
- Keep a claim true for every cabin, or name the cabin.
- Pools are seasonal: always give the dates. Every cabin is May 15 to October 15 except Clouds Reach (April 15 to November 30). Say "heated" only for Clouds Reach and Rickenbacker Ridge.
- Street addresses stay private. Give the town and drive times.
- Accessibility notes appear only where Natalie listed them (the spiral loft stair at Valhalla Hills, about 75 steps to the lake at Loch Llyn, the steep gravel drive at Rickenbacker Ridge, the stairs and spotty cell service at Dunkle Creek), stated plainly and positively, in arrival or detail sections and never next to the booking button.
- Never mention complaints. Common questions go in FAQs.
- Ratings carry their source and count ("4.99 on Airbnb, 107 reviews") and get refreshed every quarter.
- **Reviews:** never add Airbnb review text to the repo. The hosts are still deciding whether to use it. The rating stat ("Every cabin rated 4.9+ on Airbnb", "650+ reviews") is fine. Post every genuine direct review; only spam, profanity, personal info or a review from someone who didn't stay is skipped (FTC review-suppression rules). Private feedback from the review form never goes in the repo.

## Photo rules

- Photos live in `public/images/cabins/<cabin-slug>/<category>/`, as JPEGs resized to **2400px on the long side at about 80 quality**. Never commit originals: roughly 750 full-size photos would put the repo past GitHub's recommended size.
- File names follow the SEO pattern, lowercase with hyphens: `the-johnny-bedroom-2-003.jpg` (cabin, room, sequence).
- Natalie's category folders (Pool, Exterior, Bedrooms, Bathrooms and laundry...) are kept. **Galleries stay grouped by category.** The category order can change.
- Every gallery photo has a caption like Airbnb ("Bedroom 2 · Queen", "Bathroom 1") and alt text (what the photo shows, plus the cabin name).
- Natalie swaps photos herself in Pages CMS: hero, key shots, tiles, room photos and the grouped gallery are all fields on the cabin. Uploads go to `public/images` and should be resized to 2400px wide first (steps in `docs/pages-cms-guide.md`).
- The site serves photos through Netlify's Image CDN (`src/lib/img.ts`), which resizes and converts them on demand. Don't add build-time image processing.
- Only photos and video the clients own or license. Bright, warm and real: no stock, no dark and moody.
- Low-resolution originals are listed in `docs/photos-to-resend.csv`. Don't use one as a hero.

## Where things live

| What | File |
|---|---|
| A cabin's words, facts, photos, FAQs and widget code | `content/cabins/<slug>.yml` |
| Phone, email, Instagram, banner, star-rating toggle, search widget, Mailchimp, GTM | `content/settings/site.yml` |
| Check-in, minimum stay, age, shared house rules, cancellation policies | `content/settings/policies.yml` |
| Homepage, Co-hosting, About and FAQs words and photos | `content/pages/*.yml` |
| Blog posts (markdown; the file name is the URL; `draft: true` shows only before launch) | `content/blog/*.md` |
| Published reviews | `content/reviews/*.yml` |
| What the clients can edit, and how each field is labeled | `.pages.yml` |
| Content loading and defaults | `content/lib.mjs`, `content/vite-plugin.mjs` |
| The one cabin page template | `src/pages/CabinPage.tsx` |
| Other page templates | `src/pages/HomePage.tsx`, `CabinsPage.tsx`, `CoHostingPage.tsx`, `AboutPage.tsx`, `FaqsPage.tsx`, `ContactPage.tsx`, `ReviewPage.tsx`, `BlogPages.tsx` |
| Forms (guest contact, owner inquiry, insider list) | `src/components/ContactForms.tsx`, `Forms.tsx`, `public/__forms.html` |
| Redirects from the old Wix site | `docs/redirects.csv` (the build writes `_redirects` from it) |
| Header, footer, mobile bar | `src/components/Header.tsx`, `Footer.tsx`, `MobileBar.tsx` |
| Colors, type, buttons, cards, motion | `src/styles.css` |
| Icons | `src/components/Icon.tsx` |
| Page titles, descriptions, schema | `src/routes/*.tsx`, `src/lib/seo.ts` |

**Content is the source of truth.** Facts go in `/content`, never hard-coded in pages, so the clients can change them in Pages CMS. A new editable field needs three things: the YAML, a default in `content/lib.mjs` and an entry in `.pages.yml`.

**Adding or hiding a cabin** needs no code: create a cabin in Pages CMS (or copy a YAML file), or turn on "Hide this cabin from the site".

## Design system

Tokens are in `src/styles.css`, straight from the brand guide.

- **Colors:** Forest `#1F3D2E`, Cream `#F9F3E7`, Mustard `#E0A23A`, Terracotta `#C45A3A`, Sage `#8A9D7B`. Helpers: Terracotta Deep `#A8452A`, Card Cream `#FFFBF2`, Mustard Tint `#F5DDA4`, Sage Tint `#D8DFCB`, Terracotta Tint `#F3CDBB`, Soft Cream `#EFE6D2`.
- **Any text or button with text uses Terracotta Deep, not Burnt Terracotta.** Mustard and Sage are never text colors on Cream. On Forest, text is Cream or Soft Cream and accents are Mustard. On a tint, eyebrows are Forest (add `on-tint` to the section).
- **No two Cream sections touch.** Rotate Forest (`sec-forest on-forest`), a tint (`sec-sage-tint on-tint`) and Cream. Full Mustard is for the proof strip and the closing booking band.
- **Type:** Caprasimo for headlines (one weight, never faked bold, never body text), Montserrat for everything else. Classes: `h-display`, `h-section`, `h-card`, `eyebrow`, `lead`, `meta`. The script lives only in the logo.
- **The offset shadow is the signature:** a hard, unblurred shadow under a 2px Forest outline, on cards (`card`), buttons (`btn`), framed photos (`frame`) and icon tiles. Never on the logo. Shadow colors rotate across a row (`shadow-rotate`).
- **Buttons:** `btn btn-book` (Check availability, Book now) and `btn btn-cohost` (Co-host with us) always stand out from everything else and from each other. Also `btn-mustard`, `btn-light`, `btn-forest`.
- **Logo:** artwork only, from `public/images/brand/`. Never retyped or recolored. At least 64px tall; smaller than that, use the monogram. Reversed version on Forest and over photos.
- **Motion:** add `data-reveal` to fade and lift a block into view. Cards lift on hover and sink on press. No tilted photo collages, never take over the scroll, and motion is off for visitors who ask for reduced motion.
- **Icons:** Lucide line icons at a 2px stroke, plus custom hot tub, sauna, pickleball, bocce and sparkle icons drawn to match. Add new ones in the same style and list them in `.pages.yml`.

## Technical rules

- TanStack Start with every route prerendered (`vite.config.ts`). Keep new pages static so they prerender.
- New pages are `src/routes/<slug>.tsx` with a `head: () => seo({...})` call. Cabin pages are `/cabins/<slug>`.
- Use `<Photo src alt />` for photos and `<SiteLink to>` for internal links.
- Forms post to Netlify Forms through `/__forms.html`. A new form, or a new field on a form, needs a matching entry in `public/__forms.html`, or Netlify drops it. No serverless functions. Guest questions (`contact`) and owner inquiries (`owner-inquiry`) stay separate forms.
- The private review form lives at `/review`: noindex, out of the sitemap (`scripts/postbuild.mjs`) and never linked in the nav. Nothing publishes from it: a host adds each approved review in Pages CMS. See `docs/reviews.md`.
- Approved brand headlines (the homepage H1, "Find your happy place", "Happy to help", the co-hosting H1) are fixed in the page code on purpose. Everything else on those pages is in `content/pages`.
- Sections with nothing to show hide themselves: reviews, owner testimonials, the homepage story band. Don't add empty-state filler.
- Search engines are blocked until happyhocking.com is the primary domain in Netlify (`VITE_NOINDEX` in `vite.config.ts`). Don't remove that check; it turns itself off.
- Git: commit to `main`. Never force-push, rebase or amend pushed commits. The clients publish through Pages CMS, which commits to `main` too, so pull before you push.
