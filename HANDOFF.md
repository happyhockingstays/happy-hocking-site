# Handoff

Updated Nov 15, 2026 (seventh session: event dates and 12 more Wave 1 posts, in open pull requests #6 to #11). Pull requests #3, #4 and #5 are merged. Read this first in a new session, then `AGENTS.md`. **Everything that's left is in the punch list in `README.md`:** Netlify setup, questions for the clients, what Natalie should review, what they still owe, remaining build work and launch day.

The kickoff brief, brand guide, listing content, questionnaire and contract are in the "Happy Hocking" Claude project. The brief is `claude/website-build-handoff.md`.

## Status: every first-pass step is built

| Step | What | Status |
|---|---|---|
| 1 | Global layout | Done |
| 2 | Cabin page template and all 9 cabin pages | Done. Cole reviewed the template, no changes |
| 3 | Homepage | Done: the brand guide's 9 sections. The hero plays a video made from cabin photos |
| 4 | Cabins overview with filters | Done. Filters can be linked: `/cabins?group=large`, `?group=small`, `?games=1` |
| 5 | Co-hosting page with its own owner form | Done |
| 6 | About, FAQs, Contact with a topic picker | Done. About has placeholders for the story and headshots |
| 7 | Reviews system and `/review` form | Built and tested locally. The email step can't be tested until Netlify is connected |
| 8 | Blog index and post template | Done. The 13 Wix posts are moved (9 posts after merges) |
| 9 | 301 redirects from the old Wix site | Map drafted from the live Wix sitemap: `docs/redirects.csv`, explained in `docs/redirects.md` |

Not done yet outside the repo: Netlify site (waiting on the clients), branch protection, DNS. Pages CMS is installed on the repo. Cole opened it after the new screens were added (the 4 "Page:" screens and Blog posts) and saw no errors. Saving from those screens hasn't been tried.

## Seventh session (Nov 15): 12 Wave 1 posts, event dates, Netlify checked

6 pull requests, all open, all branched from `main`. They were merged together in a test: no conflicts in any order, and the combined site passes the copy check, typecheck, build, link check (53 pages) and post check.

| Pull request | What | Pages |
|---|---|---|
| #6 | This season's event dates in 4 posts | Ash Cave, Old Man's Cave, both Christmas posts |
| #7 | Wave 1, week 3, part 2 | `/blog/day-trips-from-columbus-ohio` (P091), `/blog/things-to-do-in-logan-ohio` (P072) |
| #8 | Week 4, part 1 | `/blog/how-to-plan-a-group-trip` (P022), `/blog/family-reunion-ideas` (P020), `/blog/family-reunion-games` (P021) |
| #9 | Week 4, part 2 | `/blog/cedar-falls-hocking-hills` (P052), `/blog/hocking-hills-rock-house` (P053) |
| #10 | Week 5, part 1 | `/blog/weekend-getaways-in-ohio` (P099), `/blog/day-trips-from-cincinnati` (P092), `/blog/weekend-trip-packing-list` (P103) |
| #11 | Week 5, part 2 | `/blog/cantwell-cliffs` (P054), `/blog/lake-logan-state-park` (P055) |

- **Event dates (#6):** the park lists Holidays in Ash Cave (long called Christmas in Ash Cave) on Saturday, December 12, 2026, from 3:00 to 5:00 pm. The posts had said 5:00 to 7:00 pm from earlier years. The 61st Winter Hike is Saturday, January 16, 2027, starts 9:00 to 11:00 am. Both link to the park's event pages. They go stale after January.
- **Sources:** park facts come from the Ohio Department of Natural Resources (park pages, its 2024 trail maps, its events calendar and 2 Ohio Geological Survey publications). Logan's shops, museums and welcome center come from the Hocking Hills Tourism Association, the county's tourism bureau. Venue facts come from the venue (Columbus Washboard Co., Lake Logan Marina, the National Park Service for Chillicothe). Drive times inside the region use OpenStreetMap routing, rounded to 5 minutes; longer drives use the tourism association's figures. Each pull request has a sources table.
- **A fix (#10):** 7 lines said the Hocking Hills are under 3 hours from Cincinnati or Cleveland. The tourism association says about 2.5 and 3.5. Fixed.
- **Parallel pull requests:** each one adds its rows to `docs/blog-seeds.csv` in a different spot and never edits the same lines of an older post as another, which is why they merge cleanly. A link to a page in a different open pull request is written unlinked. The list to switch on after they all merge is in the Claude project doc `claude/seo-ia-pending-changes.md`.
- **Link wording:** Cedar Falls, Rock House and Cantwell Cliffs link with their place names, like Old Man's Cave and Ash Cave. The things-to-do post's trail headings now link to the new guides instead of the tourism association. Its Lake Logan heading now reads "Lake Logan State Park".
- **Still unlinked, waiting for their pages:** Lake Hope State Park (P056), Tar Hollow State Park (P059) and John Glenn Astronomy Park (P057).
- **Netlify, checked in the browser:** `main` is a branch deploy and has built after every merge. Netlify posts GitHub checks only on pull requests, which is why it looked like `main` never built. Notes-only commits show as "Failed" ("Canceled build due to no content change"), which is the skip working. Live is still pull request #1 (Nov 12) until Monday's publish. Cole isn't on Natalie's team yet, so the preview checks in README section 1 couldn't run. The team login covers the live address as well as the previews.
- **Quadratic:** the connector needs Cole to sign in, so posts were written from the Nov 15 export. The IA edits for all 23 shipped pages are in `claude/seo-ia-pending-changes.md`.
- **Next:** Wave 1, week 6 (P045, P036, P013, P056, P057), then weeks 7 and 8. 12 new posts left.

## Wave 1 posts, week 3, part 1 (Nov 15)

2 more posts, in pull request #5 (merged Nov 15): `/blog/cabins-in-columbus-ohio` (P041) and `/blog/logan-ohio-cabins` (P040). Both are cabin guides built from the cabin files, with Lake Logan facts from the Ohio Department of Natural Resources.

- The Columbus post says plainly that the cabins aren't in Columbus: they're about an hour southeast, with Valhalla Hills the closest at about 45 minutes.
- The Logan post says plainly that no cabin is on Lake Logan (the closest are about 15 minutes away) and points to Loch Llyn's private lake.
- Neither states how many cabins there are. The Logan post says "a few more of our cabins" for the ones in other towns.
- Still to write from week 3: day trips from Columbus (P091) and things to do in Logan (P072).
- The footer signup now posts to Mailchimp (form address in Site settings).
- Netlify is linked and builds pull request previews, which sit behind Netlify's team login. It didn't build `main` after the merges. See README section 1.

## Wave 1 posts, weeks 1 and 2 (Nov 15)

5 new posts, in pull request #4 (merged Nov 15): `/blog/christmas-cabin-rentals` (P084), `/blog/christmas-getaway-ideas` (P106), `/blog/family-reunion-venues` (P019), `/blog/old-mans-cave` (P050) and `/blog/ash-cave` (P051). The other 5 posts in those 2 publish weeks were already on the site.

- Written to `docs/blog-writing.md`. Park facts come from the Ohio Department of Natural Resources (trail lengths and ratings, park and visitor center hours, the shelter houses, the Ash Cave fire tower, Christmas in Ash Cave and the Winter Hike). Cabin facts come from the cabin files.
- Event dates aren't stated, only the pattern ("usually the third Saturday of January"), because the park hadn't published this season's dates. The fire tower is noted as closed as of November 2026, per the state forest's page.
- Covers are cabin photos: no park photos are in the repo, since the clients don't own any.
- 7 older posts link to the new ones. Seeds of pages that aren't written yet ("family reunion ideas", "family reunion games", "weekend getaways in Ohio", "Cedar Falls") are in the copy unlinked.
- New: `npm run posts` checks each post against its seed and supporting terms in `docs/blog-seeds.csv`. Only posts that are written are listed there. The full plan stays in the IA, because this repo is public.

## Sixth session (Nov 15): pre-launch pass

Done without Netlify, in pull request #3 (merged Nov 15). Nothing here has been seen on a Netlify preview yet: see README section 1.

- **Pull request #2 folded in:** the 404 page and the "direct costs less" edit. It had fallen behind `main` and conflicted in `scripts/postbuild.mjs`.
- **4 collection pages** at the IA's URLs: `/hocking-hills-cabins-with-pool` (seed "hocking hills cabins with pool"), `/hocking-hills-large-group-cabins` ("cabin rentals for large groups"), `/hocking-hills-cabins-with-game-room` ("cabins with game rooms") and `/hocking-hills-luxury-cabins` ("luxury cabins hocking hills"). One template (`src/pages/CollectionPage.tsx`), words in `content/collections/*.yml`, editable in Pages CMS. Sleeps, bedrooms, towns and pool dates come from the cabin files, so they can't drift. Each page has CollectionPage, BreadcrumbList and FAQPage schema. Linked from the footer ("Find a cabin"), the Cabins page and each other, never the top menu.
- **Judgment calls on those pages:** the luxury page shows 6 cabins, picked for a sauna, a heated pool, a lake or acreage. The large group page lists the 7 cabins that sleep 10 or more (the IA's range), while the Cabins page filter still calls 13 or more a large group. The luxury H1 and H2 use "luxury cabins in Hocking Hills" and "Hocking Hills luxury cabins"; the exact seed is in the Google title, the description and the first line. Indoor pools and log cabins aren't targeted (the IA's rules).
- **Links from older posts:** 6 posts now link to the collection pages with their seeds. The 3 links to filtered views of the Cabins page were swapped for collection pages.
- **Privacy page** at `/privacy`, in the footer. A plain-language draft for the clients to read.
- **Share images:** 29 cards in `public/images/share`, one per page, made by `scripts/make-share-images.py`. `seo()` finds them by name.
- **Technical fixes:** `/cabins?group=` and `?games=` are out of the sitemap. Photos inside posts go through the image service on Netlify and carry their width and height. Share tags carry the image size and alt text. The homepage has WebSite schema.
- **Cabin pages:** the map placeholder is gone. The section keeps the town note and drive times, side by side.
- **New checks:** `npm run check` now covers collection pages. `npm run links` (after a build) reports broken links, link wording that points at 2 pages and pages nothing links to.
- **New doc:** `docs/blog-writing.md`, Cole's blog playbook fitted to this site, for the Wave 1 posts.
- Checked: copy check, typecheck, build and link check pass. 34 pages, 30 in the sitemap, no duplicate titles or descriptions. Screenshots of every new page at phone and desktop widths: no sideways scrolling. The Hospitable search card shows empty in the test browser because it can't reach Hospitable.

## Fourth session (Nov 12): SEO on-page pass

Every page that was already in the repo now targets its seed from the approved IA (v1.1, published in Lookout as client slug `hh-5cbs23`). The IA lives in Cole's Quadratic file; Lookout shows the same map.

- **Home, cabins overview, co-hosting:** titles, descriptions, leads, alt text and one H2 or FAQ each carry the seed ("cabins in hocking hills", "hocking hills cabin rentals", "hocking hills property management"). The approved brand headlines didn't change. The cabins page H1 is now "Hocking Hills cabin rentals".
- **Cabin pages:** each has a seed with search volume (the cabin name stays in the URL, nav and H1). New optional field `aboutHeading` (Pages CMS: "About this home, heading") puts the seed in the About H2; blank falls back to "About this home". Fact fixes: Valhalla Hills and Rickenbacker Ridge are about 40 minutes from Old Man's Cave, not 20 to 30, and Valhalla's copy no longer mentions milestone birthdays (the events rule).
- **Blog:** the 11 Wix posts are now 9 posts at their IA slugs (`/blog/cabins-for-winter`, `/blog/fall-weekend-getaways`, `/blog/summer-weekend-getaways`, `/blog/pickleball-getaways`, `/blog/large-group-cabin-rentals-ohio`, `/blog/how-to-plan-a-family-reunion`, `/blog/things-to-do-in-hocking-hills-for-adults`, `/blog/weekend-getaways-from-columbus-ohio`, `/blog/vacation-rental-by-owner-ohio`). The fall foliage post merged into the fall weekend post and the "explore" post into the things-to-do post. Each post was retargeted (title, Google title, summary, intro, H2s, internal links using the target page's seed as the anchor) and has 3 to 5 FAQs.
- **Post FAQs:** new optional `faqs` list on posts (Pages CMS: "Questions under the post"), shown under the post with FAQPage schema. Also a `updated` date field.
- **Redirects:** every old Wix post address points straight at its new slug. The posts' first addresses on this site redirect too (kind `renamed` in `docs/redirects.csv`, written as same-site rules by `scripts/postbuild.mjs`). Added the 3 missing Wix addresses from the IA's redirect map: `/valhallacopy`, `/dunkle-creek`, `/lead-collection`.
- **Airbnb trademark line:** Airbnb's trademark guidelines ask any site that names Airbnb to say it isn't affiliated. It's now in the footer and under the owner form. Airbnb and Vrbo may appear in body copy and URLs, never in titles or headings (Cole's rule, matching Airbnb's guidelines).
- Checked: `npm run check`, `npm run typecheck` and `npm run build` pass, no broken internal links, no anchor text pointing at 2 different pages, FAQ schema on posts and cabins, and screenshots of the changed sections at phone and desktop widths.

## Third session (Nov 11)

- **Accounts:** Cole started transferring this repo to Natalie's GitHub account (`happyhockingstays`). Her Netlify site (`animated-kheer-a8b74a.netlify.app`, Free plan, she's the only member) still points at an empty repo. On Free, a private repo only deploys the owner's commits, so this repo goes public. Cole emailed her the setup steps (punch list section 1): accept the transfer, make it public, give Netlify, Pages CMS and Claude access, link Netlify with `live` as the production branch and `main` as a branch deploy, turn on forms, invite Cole as a Reviewer.
- **Staying on Netlify Free:** `main` builds as a free preview (`main--animated-kheer-a8b74a.netlify.app`). The real site builds from `live`, which `.github/workflows/publish.yml` updates from `main` on Mondays and Thursdays (only if something changed) or on demand. Notes-only commits skip the build (`netlify.toml`). The preview is never indexed (`vite.config.ts` checks `CONTEXT`). The hero video was re-rendered at 24 fps and a higher CRF: 2.8 MB wide, 1.6 MB tall, down from 4.1 MB and 2.4 MB.
- **Team photos:** Natalie's and Dave's headshots are on the About page, and the photo of the 2 of them is in the homepage story band (now square, framed toward the top). Dave's headshot and the team photo are under 600 px, so ask for larger versions.
- **Mailchimp:** the "connected site" script is a new Site setting (`mailchimpSiteScript`), loaded in the page head on every page. Mailchimp can only verify it once happyhocking.com is live. The footer signup still needs the embedded form's address (`mailchimpAction`).
- **Blog:** all 13 Wix posts handled. 11 are in `content/blog` with their old names, edited only for the brand rules and facts, and illustrated with cabin photos instead of the Wix stock photos. The 2 "2026 winter guide" posts were Wix HTML boxes with no readable text, so their old addresses go to the winter weekend post. Every old address now redirects permanently. The sample post is deleted. `scripts/check.mjs` lets the business name "Oasis Coffee Shop" through the banned-word check.
- **Drive times** for every cabin to Old Man's Cave, Ash Cave, Cedar Falls, Lake Logan and downtown Logan (plus Lancaster for Rickenbacker Ridge and Columbus for Valhalla Hills). Looked up from the questionnaire addresses with the US Census geocoder and OpenStreetMap routing, rounded to 5 minutes, keeping the listing's number where it gave one. Dunkle Creek's address didn't match exactly, so its times use the road.
- **Share image:** `public/images/brand/og-happy-hocking-stays.jpg` is now The Farm's pool with the logo card.
- **Old co-hosting domain:** `scripts/postbuild.mjs` sends every page of hockinghills-hosting.com to `/co-hosting` once that domain points at Netlify.
- **Natalie's answers:** no larger photo originals; summer photos are the default; no fall photos at Dunkle Creek or The Johnny for now; bedroom numbers match Airbnb (Pickle Hill's Airbnb text has Bedrooms 4 and 5 swapped). Both old domains are registered at GoDaddy in an account the clients don't control yet.

## What was checked, and what wasn't

- Every page was built and screenshotted at phone and desktop widths: no broken photos, no sideways scrolling, no console errors.
- Forms were filled in and submitted in a test browser with Netlify's endpoint faked: the right fields go out for the review, contact and owner forms, the thank-you and error states show, required fields block an empty send, and `?cabin=` picks the cabin.
- Reviews were tested with 4 temporary fake reviews (homepage carousel, cabin section, star badge with the toggle on), then removed. No review files are in the repo.
- `npm run check`, `npm run typecheck` and `npm run build` pass.
- The hero video was played in a test browser at computer and phone sizes. With reduced motion turned on it stays a still photo until the visitor presses play.
- **Not verified:** a real Netlify form submission and its email, the Image CDN, the redirect rules on Netlify, and saving from the new Pages CMS screens. All need the Netlify site.

## How it's built

- Same stack as Serenity Lodge (TanStack Start, prerendered, Netlify). The difference: every fact and photo lives in YAML under `/content` so the clients can edit it in Pages CMS.
- `content/lib.mjs` loads and defaults the content. `content/vite-plugin.mjs` exposes `virtual:content` (settings, policies, page copy, published reviews, post summaries, cabin cards) and turns each cabin file and each blog post into its own page chunk.
- Page copy for Home, Co-hosting, About and FAQs is in `content/pages/*.yml`. Approved brand headlines are fixed in the page code.
- Blog posts are markdown in `content/blog`. A post with `draft: true` is built only while the site is still blocked from search engines, so the template can be reviewed before launch.
- Forms are Netlify Forms: `insider-list`, `contact`, `owner-inquiry`, `review`.
- `scripts/postbuild.mjs` tidies the sitemap and writes `_redirects` from `docs/redirects.csv`.
- The homepage hero video (`public/video/`) is made from 7 cabin photos by `scripts/make-hero-video.py`: slow pans, crossfades, a clean loop, a wide cut and a tall cut. It's a one-off tool, not part of the build. `src/components/HeroVideo.tsx` fades it in over the hero photo and has a pause button.

## Decisions

Cole has been through every default from both sessions (Nov 9). Settled:

- First session's defaults accepted. The Valhalla tagline is "fine for now" and the top banner stays.
- Instagram is @HockingHillsHosting. Hero photos follow each Airbnb listing.
- Owner fees and fit criteria are not published. The service area lists the 5 towns they host in.
- Phoenix Landing redirects to `/cabins`.
- The homepage hero should look like a video, as on Serenity Lodge. Done with a clip made from photos, since the clients haven't sent footage.
- The drafted copy (17 guest FAQs, "3 things we do really well", service cards, team roles) goes to Natalie when Cole asks her to review the site.

How the hero photos were picked: the main photo and 4 key shots on every cabin match the lead photos on its Airbnb listing. Where Airbnb leads with an indoor shot (Loch Llyn's bedroom, Clouds Reach's sunroom, Rickenbacker Ridge's poker table), the first outdoor photo from the same set is the main photo. Where Airbnb shows a fall or dusk version that isn't in the Dropbox set, the same view in daylight is used (Valhalla Hills, Dunkle Creek, The Johnny).

Other choices made while building, all easy to change: the homepage cabin row shows every cabin; the Hocking Hills photo band uses Loch Llyn's lake; review sections stay hidden until a review is published; the Contact topic picker swaps between 2 separate forms; the review form's month is a dropdown of the last 18 months and the phone bottom bar is hidden there; blog post addresses keep their Wix names; posts not moved yet redirect to the blog page as temporary redirects.

## Fifth session (Nov 15): Hospitable widgets

- Booking widget code is in every cabin file. Property IDs: Valhalla Hills 752630, Loch Llyn 1094000, Clouds Reach 1160468, Pickle Hill 1385354, Rickenbacker Ridge 1516018, The Farm 1727924, Dunkle Creek 1963708, The Johnny 2023752, Lazy Deer 2501719.
- Site settings now has 2 Hospitable fields: `searchWidget` (the search bar, Hospitable Step 2, `results-url="/search"`) and the new `searchResultsWidget` (Hospitable Step 1). The new `/search` page shows the results: noindex and left out of the sitemap.
- Hospitable's Step 3 script is not used. Its booking loader (`widget-loader.prod.js`) already reads checkin, checkout, adults, children, infants and pets from the page address and adds them to the booking iframe. It also checks that the cabin's name appears on the page and pings Hospitable with the page address.

## Placeholders still in the site

Natalie's story, bios, owner testimonials (hidden until one is added), guest reviews (hidden until one is published), a real Hocking Hills photo, the Mailchimp address and GTM ID.

## Photos

- All 748 gallery photos have hand-written descriptions (alt text).
- 57 photos are under 2000 px wide. They're fine in cards, tiles, the cabin page mosaic and gallery thumbnails. They only look soft opened full screen on a big monitor, or stretched full width.
- 10 of the 57 are a cabin's main photo or one of its top 5. Cole emailed Natalie for those on Nov 9. `docs/photos-to-resend.csv` is sorted by priority.
- Not in the Dropbox set at all, but on Airbnb: Valhalla Hills at dusk with the fire going, Dunkle Creek at night and in fall, The Johnny's fall fire pit and pond, Pickle Hill's stone fire pit.

## Known loose ends

- `_web-ready/_transfer-temp/` on Cole's Mac holds empty leftover files and can be deleted.
- Pages CMS shows no errors, but these haven't been used for real yet: saving a blog post (the body field and the file name made from the title), and the reference fields for "Similar cabins" and a review's cabin.
- The old domains (hockinghills-cabinrentals.com and hockinghills-hosting.com) are in a GoDaddy account the clients don't control yet. Needed before launch.
