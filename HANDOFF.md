# Handoff

Updated Nov 9, 2026. Read this first in a new session, then `AGENTS.md`.

The kickoff brief, brand guide, listing content, questionnaire and contract are in the "Happy Hocking" Claude project. The brief is `claude/website-build-handoff.md`.

## Status: first pass, steps 1 and 2 done

| Step | What | Status |
|---|---|---|
| 1 | Global layout: centered-logo header, two CTA buttons, mobile bottom bar, footer with insider list signup | Done |
| 2 | Cabin page template and all 9 cabin pages at `/cabins/<slug>` | Done, with placeholders listed below |
| 3 | Homepage | Placeholder only (hero, proof strip, cabin grid) |
| 4 | Cabins overview with group-size and games/sports filters | Working basic version. Needs the search widget and a design pass |
| 5 | Co-hosting page with its own owner contact form | Stub |
| 6 | About, FAQs, Contact with a topic picker | Stubs |
| 7 | Reviews system and `/review` form | Data and display are wired (collection, toggle, cabin section, star badge). The form page, Netlify form and Hospitable message are not built |
| 8 | Blog index and post template | Stub |
| 9 | 301 redirects from every old Wix URL | Not started |

Also done: repo set up from the Serenity Lodge structure, brand tokens and UI kit, 748 photos processed and wired in, Pages CMS config for cabins, reviews, settings and policies, `CLAUDE.md` rules, copy checker.

Not done yet outside the repo: Netlify site, Pages CMS connection, branch protection, DNS.

## How it's built

- Same stack as Serenity Lodge (TanStack Start, prerendered, Netlify). The difference: every fact and photo lives in YAML under `/content` so the clients can edit it in Pages CMS. Serenity keeps facts in `src/data/site.ts`.
- `content/lib.mjs` loads and defaults the YAML. `content/vite-plugin.mjs` exposes `virtual:content` (settings, policies, cabin cards) and turns each cabin file into its own page chunk.
- One template, `src/pages/CabinPage.tsx`, follows the brand guide's 12-section cabin page order.
- Photos are 2400px JPEGs in `public/images/cabins`, served through Netlify's Image CDN. Locally and in static previews the original files are used.
- Shared policies (check-in, minimum stay, age, house rules, cancellation) are in one file. A cabin only stores what differs: check-out time, quiet hours, extra rules, which cancellation policy.

## Decisions defaulted, for Cole to confirm

From the brand guide's open list:

1. **Valhalla tagline:** "A place to celebrate", with the edited card line. Both are fields on the cabin.
2. **Top banner:** kept, one line: "Book direct and skip the booking-site service fees". On/off switch and text are in Site settings.
3. **Instagram:** @happyhocking. One field in Site settings.
4. **Mushroom and sun icons:** not used. The sparkle from the monogram does the accent work.
5. **Owner fee range, owner fit criteria, homepage cabin row:** not reached yet. They belong to the co-hosting page and homepage steps.

Made during the build:

6. **Reversed logo:** made from Natalie's SVG. "Hocking" and "STAYS" are Cream, "Happy" stays Mustard. Terracotta on Forest fails the brand guide's contrast table. Easy to change in `public/images/brand/wordmark-reversed.svg`.
7. **Only 2 logo SVGs arrived** (wordmark and monogram). The compact wordmark isn't needed on the site. The monogram was recolored to Forest and Mustard per the brand guide.
8. **Navigation:** Cabins, About, Blog and FAQs left of the logo; Contact and the two buttons on the right. Co-hosting appears only as its button.
9. **Phones:** the header keeps a small "Co-host" button, and the bottom bar has Contact and Book now. After scrolling, the header shrinks and swaps the wordmark for the HH monogram.
10. **Contact details:** the business phone and the current Gmail address from the project notes, until the new business email exists.
11. **Airbnb rating line** under each cabin name ("4.98 on Airbnb, 125 reviews"). It's a rating stat, not review text. Clear the field to hide it.
12. **Quiet hours** come from each Airbnb listing. Loch Llyn, Rickenbacker Ridge and The Farm list none, so their tile is hidden.
13. **Room order** follows Natalie's photo numbering where it differs from Airbnb: Dunkle Creek and Pickle Hill.
14. **Hero photos** follow the brand guide's table, with two exceptions. The Farm leads with the pool and house, with the sports barn as the first key shot. The Johnny leads with the pond, because there is no photo of the back deck over it.
15. **Insider list** signups save to Netlify Forms until the Mailchimp form address is added in Site settings.
16. **Search engines are blocked** until happyhocking.com is the primary domain in Netlify. It switches itself off.
17. **Web-ready photos on Cole's Mac** are in `Website Photography/_web-ready/`, inside the connected folder rather than beside it, because only that folder was connected.

## Placeholders still in the site

- Hospitable booking widget on all 9 cabin pages, and the search widget on Home and Cabins
- Area map on every cabin page
- Drive times: only the ones stated in the listings. Old Man's Cave, Ash Cave, Cedar Falls, Lake Logan and downtown Logan are missing for most cabins. Street addresses are in the questionnaire, for lookups only
- Homepage, Co-hosting, About, FAQs, Contact and Blog pages
- Guest reviews: none published, so the section is hidden. No Airbnb review text is in the repo
- Mailchimp form address and Google Tag Manager ID
- Share image: a plain wordmark card for now
- Gallery photo descriptions are generic ("Pool at Clouds Reach")
- 57 low-resolution photos to be resent (`docs/photos-to-resend.csv`)

## Still waiting on the clients

Hospitable widget codes (9 cabins plus search), Mailchimp embed code, Natalie's About story, headshots, owner testimonials, hero video clip, the checklist of what they handle for owners, the FAQ list, the business email, and their decision on Airbnb soundbites.

## Next steps

1. Cole: connect Netlify and Pages CMS to the repo, then review the cabin template and the defaults above.
2. Step 3, the homepage, from the brand guide's 9-section list.
3. Steps 5 to 9 in order. The redirect map needs the old blog URLs from the live Wix sitemap.
4. Look up the missing drive times and draw the area map.
5. Send Natalie the photo notes in `docs/photos.md`.

## Known loose ends

- On Cole's Mac, two Clouds Reach files in `_web-ready` still have the names `clouds-reach-bedrooms-x001.jpg` and `-x002.jpg`. In the repo they are `-015` and `-016`.
- `_web-ready/_transfer-temp/` on Cole's Mac holds empty leftover files and can be deleted.
- Pages CMS field options (number min and max, reference fields for "Similar cabins" and the review's cabin) follow the current docs but haven't been tried in the live editor yet. Check them when Pages CMS is connected.
