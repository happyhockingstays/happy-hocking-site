# Handoff

Updated Nov 9, 2026 (second session). Read this first in a new session, then `AGENTS.md`. **Everything that's left is in the punch list in `README.md`:** Netlify setup, questions for the clients, what Natalie should review, what they still owe, remaining build work and launch day.

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
| 8 | Blog index and post template | Done, with 1 sample draft post. The 13 Wix posts are not moved yet |
| 9 | 301 redirects from the old Wix site | Map drafted from the live Wix sitemap: `docs/redirects.csv`, explained in `docs/redirects.md` |

Not done yet outside the repo: Netlify site (waiting on the clients), branch protection, DNS. Pages CMS is installed on the repo. Cole opened it after the new screens were added (the 4 "Page:" screens and Blog posts) and saw no errors. Saving from those screens hasn't been tried.

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

## Placeholders still in the site

Hospitable booking and search widgets, the area map and most drive times, Natalie's story, headshots and bios, owner testimonials (hidden until one is added), guest reviews (hidden until one is published), the 13 Wix posts, a real Hocking Hills photo, the Mailchimp address and GTM ID, the share image.

## Photos

- All 748 gallery photos have hand-written descriptions (alt text).
- 57 photos are under 2000 px wide. They're fine in cards, tiles, the cabin page mosaic and gallery thumbnails. They only look soft opened full screen on a big monitor, or stretched full width.
- 10 of the 57 are a cabin's main photo or one of its top 5. Cole emailed Natalie for those on Nov 9. `docs/photos-to-resend.csv` is sorted by priority.
- Not in the Dropbox set at all, but on Airbnb: Valhalla Hills at dusk with the fire going, Dunkle Creek at night and in fall, The Johnny's fall fire pit and pond, Pickle Hill's stone fire pit.

## Known loose ends

- `_web-ready/_transfer-temp/` on Cole's Mac holds empty leftover files and can be deleted.
- Pages CMS shows no errors, but these haven't been used for real yet: saving a blog post (the body field and the file name made from the title), and the reference fields for "Similar cabins" and a review's cabin.
- Bedroom numbering at Dunkle Creek and Pickle Hill follows Natalie's photo folders, which differ from Airbnb's order. Waiting on her answer.
- `hockinghills-hosting.com`, the old co-hosting site, isn't in the redirect map.
