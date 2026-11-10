# Handoff

Updated Nov 9, 2026 (second session). Read this first in a new session, then `AGENTS.md`.

The kickoff brief, brand guide, listing content, questionnaire and contract are in the "Happy Hocking" Claude project. The brief is `claude/website-build-handoff.md`.

## Status: every first-pass step is built

| Step | What | Status |
|---|---|---|
| 1 | Global layout | Done |
| 2 | Cabin page template and all 9 cabin pages | Done. Cole reviewed the template, no changes |
| 3 | Homepage | Done: the brand guide's 9 sections |
| 4 | Cabins overview with filters | Done. Filters can be linked: `/cabins?group=large`, `?group=small`, `?games=1` |
| 5 | Co-hosting page with its own owner form | Done |
| 6 | About, FAQs, Contact with a topic picker | Done. About has placeholders for the story and headshots |
| 7 | Reviews system and `/review` form | Built and tested locally. The email step can't be tested until Netlify is connected |
| 8 | Blog index and post template | Done, with 1 sample draft post. The 13 Wix posts are not moved yet |
| 9 | 301 redirects from the old Wix site | Map drafted from the live Wix sitemap: `docs/redirects.csv`, explained in `docs/redirects.md` |

Not done yet outside the repo: Netlify site (waiting on the clients), branch protection, DNS. Pages CMS is installed on the repo and Cole saw no field errors on the cabin screens. The new screens (the 4 "Page:" screens and Blog posts) were added after that and haven't been opened in the live editor yet.

## What was checked, and what wasn't

- Every page was built and screenshotted at phone and desktop widths: no broken photos, no sideways scrolling, no console errors.
- Forms were filled in and submitted in a test browser with Netlify's endpoint faked: the right fields go out for the review, contact and owner forms, the thank-you and error states show, required fields block an empty send, and `?cabin=` picks the cabin.
- Reviews were tested with 4 temporary fake reviews (homepage carousel, cabin section, star badge with the toggle on), then removed. No review files are in the repo.
- `npm run check`, `npm run typecheck` and `npm run build` pass.
- **Not verified:** a real Netlify form submission and its email, the Image CDN, the redirect rules on Netlify, and the new Pages CMS screens in the live editor. All 4 need the Netlify site.

## How it's built

- Same stack as Serenity Lodge (TanStack Start, prerendered, Netlify). The difference: every fact and photo lives in YAML under `/content` so the clients can edit it in Pages CMS.
- `content/lib.mjs` loads and defaults the content. `content/vite-plugin.mjs` exposes `virtual:content` (settings, policies, page copy, published reviews, post summaries, cabin cards) and turns each cabin file and each blog post into its own page chunk.
- Page copy for Home, Co-hosting, About and FAQs is in `content/pages/*.yml`. Approved brand headlines are fixed in the page code.
- Blog posts are markdown in `content/blog`. A post with `draft: true` is built only while the site is still blocked from search engines, so the template can be reviewed before launch.
- Forms are Netlify Forms: `insider-list`, `contact`, `owner-inquiry`, `review`.
- `scripts/postbuild.mjs` tidies the sitemap and writes `_redirects` from `docs/redirects.csv`.

## Decisions defaulted, for Cole to confirm

Cole went through the first session's list of defaults on Nov 9 and accepted them, with 2 changes: Instagram is @HockingHillsHosting, and hero photos follow each Airbnb listing. The Valhalla tagline ("A place to celebrate") is "fine for now". The top banner stays.

New in this session:

1. **Hero photos:** the main photo and 4 key shots on every cabin match the lead photos on its Airbnb listing. Where Airbnb leads with an indoor shot (Loch Llyn's bedroom, Clouds Reach's sunroom, Rickenbacker Ridge's poker table), the first outdoor photo from the same set is the main photo and the indoor one is a key shot. Where Airbnb shows a fall or dusk version that isn't in the Dropbox set, the same view in daylight is used (Valhalla Hills, Dunkle Creek, The Johnny).
2. **Homepage cabin row:** every cabin, in a row that scrolls sideways, in the cabins' display order.
3. **Homepage hero:** a photo for now (The Farm from the air). The video fields are ready in Pages CMS for when a clip arrives.
4. **Hocking Hills photo band:** uses Loch Llyn's lake, because there are no owned photos of the caves or trails yet.
5. **Homepage reviews section:** hidden until the first review is published, like the cabin pages.
6. **Owner fees:** not published. The owner FAQ says fees are covered on the intro call.
7. **Owner fit criteria:** not published. Step 2 of "How we get started" says "If it looks like a fit".
8. **Service area** in the owner FAQ: Logan, Lancaster, Laurelville, Sugar Grove and McArthur, the towns where they host today. Needs Natalie's OK.
9. **"3 things we do really well"** and the 6 service cards are drafted from the mockup and the old hosting site. The specific checklist of what they handle is still to come from Natalie.
10. **Team roles:** "Co-owner and host" for both. No bios yet.
11. **About page headline:** "The crew behind Happy Hocking Stays", with the approved boilerplate paragraph as the intro.
12. **Guest FAQs:** 17 questions drafted from the questionnaire, the mockup and the policies. Natalie said she'd send her own list, so treat these as placeholders for her to correct.
13. **Contact page:** the topic picker swaps between 2 separate forms, so owner messages never land with guest questions.
14. **Review form:** the month of stay is a dropdown of the last 18 months. The mobile bottom bar is hidden on `/review`.
15. **Blog:** categories carried over from the Wix blog. Post addresses keep their Wix names, so `/post/x` becomes `/blog/x`.
16. **Old posts not moved yet** redirect to the blog page as temporary redirects, and switch to permanent ones by themselves once each post exists.
17. **Phoenix Landing** (a cabin page on the old site) redirects to `/cabins`.

## Placeholders still in the site

- Hospitable booking widget on all 9 cabin pages, and the search widget on Home and Cabins
- Area map on every cabin page, and most drive times
- About: Natalie's story, both headshots, bios
- Co-hosting: owner testimonials (the section is hidden until one is added), Natalie's checklist
- Guest reviews: none published, so those sections are hidden. No Airbnb review text is in the repo
- Blog: 1 sample draft post. The 13 Wix posts still need moving
- Hero video
- A real Hocking Hills photo for the homepage photo band
- Mailchimp form address and Google Tag Manager ID
- Share image: a plain wordmark card for now

## Photos

- All 748 gallery photos have hand-written descriptions (alt text).
- 57 photos are under 2000 px wide. They're fine in cards, tiles, the cabin page mosaic and gallery thumbnails. They only look soft opened full screen on a big monitor, or stretched full width.
- 10 of the 57 are a cabin's main photo or one of its top 5. Those are the ones to ask Natalie for. `docs/photos-to-resend.csv` is sorted by priority.
- Not in the Dropbox set at all, but on Airbnb: Valhalla Hills at dusk with the fire going, Dunkle Creek at night and in fall, The Johnny's fall fire pit and pond, Pickle Hill's stone fire pit.

## Still waiting on the clients

Netlify account, Hospitable widget codes (9 cabins plus search), Mailchimp embed code, Natalie's About story, headshots, owner testimonials, hero video clip, the checklist of what they handle for owners, the FAQ list, the business email, the 10 full-size photos, and their decision on Airbnb soundbites.

## Next steps

1. Cole: send Natalie the photo request (10 originals, the missing Airbnb photos, the bedroom-number check).
2. When Netlify is ready: connect the repo, enable form detection, add the form notification emails (`docs/reviews.md`), then send a test through each form.
3. Open the 4 "Page:" screens and Blog posts in Pages CMS and check for field errors.
4. Second pass: move the 13 Wix blog posts into `content/blog` with the same names, look up the missing drive times, draw the area map.
5. Natalie or Dave: set up the post-checkout review message in Hospitable (`docs/reviews.md`).
6. At launch: follow `docs/redirects.md`.

## Known loose ends

- `_web-ready/_transfer-temp/` on Cole's Mac holds empty leftover files and can be deleted.
- Pages CMS options not yet tried in the live editor: the blog body field (markdown rich text saved as the post body), the file name made from the post title, and the reference fields for "Similar cabins" and a review's cabin.
- Bedroom numbering at Dunkle Creek and Pickle Hill follows Natalie's photo folders, which differ from Airbnb's order. Waiting on her answer.
- `hockinghills-hosting.com`, the old co-hosting site, isn't in the redirect map.
