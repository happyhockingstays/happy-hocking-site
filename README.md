# Happy Hocking Stays website

Direct-booking and co-hosting site for Happy Hocking Stays, private cabins in the Hocking Hills of Ohio.
Live domain: **happyhocking.com** (happyhockingstays.com forwards to it).

**Stack:** TanStack Start, React 19, Tailwind CSS v4 and self-hosted fonts. Every page is prerendered to static HTML at build time. Hosting is Netlify, bookings run on Hospitable widgets, and the clients edit content in Pages CMS.

**Picking this up in a new chat?** Attach this repo, then say: "Read `HANDOFF.md` and the punch list in `README.md`, then do [the item]." `HANDOFF.md` has what's built and why. The punch list below has everything that's left. Project rules for Claude and Cursor are in `AGENTS.md`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in dist/client
npm run serve      # serve the build the way Netlify does, at http://localhost:4173
npm run typecheck
npm run check      # brand copy rules across content and pages
```

Node 22+.

## How editing works

- **Pages CMS** (app.pagescms.org) is the clients' editing window. `.pages.yml` defines what they see: Cabins, Reviews, the main pages, Blog posts, Site settings and Policies. Saving publishes to the live site in about 2 minutes.
- **GitHub** keeps every version. Anything can be undone.
- **Netlify** rebuilds and publishes on every change.
- **Hospitable** stays separate and handles bookings. Its widget code is pasted into Pages CMS and never edited.

Plain-language steps for the clients are in `docs/pages-cms-guide.md`.

## Where things live

| What | File |
|---|---|
| Cabin content (words, facts, photos, FAQs, widget code) | `content/cabins/*.yml` |
| Site settings and shared policies | `content/settings/*.yml` |
| Homepage, Co-hosting, About and FAQs copy | `content/pages/*.yml` |
| Blog posts (markdown, the file name is the URL) | `content/blog/*.md` |
| Published reviews | `content/reviews/*.yml` |
| Pages CMS setup | `.pages.yml` |
| Cabin page template | `src/pages/CabinPage.tsx` |
| Global layout | `src/components/Header.tsx`, `Footer.tsx`, `MobileBar.tsx`, `Layout.tsx` |
| Design tokens and UI kit | `src/styles.css` |
| Photos | `public/images/cabins/<cabin>/<category>/` |
| Logo files | `public/images/brand/` |
| Homepage hero video, made from cabin photos | `public/video/`, rebuilt with `scripts/make-hero-video.py` |
| Photo notes and the resend list | `docs/photos.md`, `docs/photos-to-resend.csv` |
| Reviews: how they work, the Hospitable message, Netlify emails | `docs/reviews.md` |
| Redirects from the old Wix site | `docs/redirects.md`, `docs/redirects.csv` |

---

# Punch list

Updated Nov 9, 2026. Every page in the first pass is built. This is what's left before launch, grouped by who does it. Cross items off here as they're done.

## 1. Cole: set up Netlify (as soon as the clients have an account)

Nothing below can be tested until this is done.

1. Have Dave or Natalie create a Netlify account with the business email, then invite you to the team.
2. In Netlify, click **Add new project**, then **Import an existing project**, then **GitHub**, and pick `happy-hocking-site`. Leave the build settings alone. They come from `netlify.toml`.
3. Wait for the first deploy, then open the `something.netlify.app` address it gives you.
4. Check 3 things on that address: cabin photos load, the homepage video plays, and every page in the menu opens.
5. Click **Forms** in the left menu. If it asks, click **Enable form detection**.
6. Redeploy once so Netlify finds the forms: **Deploys**, **Trigger deploy**, **Deploy project**.
7. Go to **Forms**, **Submission notifications**, **Add notification**, **Email notification**. Pick the form **review** and type the address that should get reviews. Save.
8. Repeat step 7 for **contact** (guest questions), **owner-inquiry** (co-hosting) and **insider-list** (email signups). Each can go to a different person. The address has to belong to someone on the Netlify team.
9. Send a test through each form on the Netlify address and confirm each email arrives:
   - `/review?cabin=pickle-hill` (check that Pickle Hill is already picked)
   - `/contact` with "A stay" picked
   - `/contact` with "Co-hosting" picked
   - `/co-hosting`, the form near the bottom
   - the insider list signup in the footer
10. Change one word in Pages CMS, save, and confirm the site updates in about 2 minutes.
11. In GitHub, open the repo's **Settings**, **Branches**, and add a rule for `main` that blocks force pushes and deletions. Don't require pull requests: Pages CMS saves straight to `main`.
12. Don't add happyhocking.com yet. That's launch day (section 6).

If anything in steps 4 to 10 fails, start a chat with the repo attached and say which step. These parts were built and tested locally but have never run on Netlify: form emails, the photo resizing service, and the new Pages CMS screens saving.

## 2. Questions for Natalie and Dave

Already asked, waiting on answers:

1. The 10 full-size photos, and the Airbnb lead photos that aren't in Dropbox (email sent Nov 9).
2. Bedroom numbers at Dunkle Creek and Pickle Hill: follow her photo folders (what the site does now) or Airbnb's order?

Still to ask:

3. **Hero video.** The homepage plays a 25-second clip made from their photos. Do they have real footage (drone or walkthrough) to replace it? If yes: 10 to 20 seconds, a wide cut and a tall cut, no sound.
4. **Who gets each email:** guest reviews, guest questions and co-hosting inquiries. One address or 3?
5. **Business email.** The site shows HockingHillsHosting@gmail.com until the new one exists. The same address should own the Netlify and GitHub accounts.
6. **Instagram.** The site links @HockingHillsHosting. They planned to rename it. Tell us when.
7. **Airbnb soundbites:** use short Airbnb review quotes or not? Nothing from Airbnb is on the site. If yes, they add each one under Reviews with Source set to Airbnb.
8. **Old co-hosting site.** Is hockinghills-hosting.com being retired? If so it should redirect to `/co-hosting`.
9. **Valhalla Hills tagline.** "A place to celebrate" is on the site as the proposed line. Final?
10. **Privacy policy.** The forms collect names and emails, so the site should have a short privacy page. It isn't in the first pass. OK to add one?
11. **Accounts.** GitHub and Netlify should end up in accounts they own. The repo is in Cole's GitHub for now. When do they want the handover?

## 3. For Natalie to read and correct

These were drafted from her questionnaire, the mockup and the Airbnb listings. None of it is her wording yet. Each is editable in Pages CMS.

1. **Page: FAQs.** All 17 guest questions. Look hardest at: which cabins suit which groups, pool dates, quiet hours, payments ("up to 3 installments", "most major credit cards"), and the check-in answer.
2. **Page: Co-hosting.** The "3 things we do really well" cards, the 6 service cards, "It stays your home", the 3 steps and the 5 owner FAQs. Fees are not published (the FAQ says they're covered on the intro call). The service area lists Logan, Lancaster, Laurelville, Sugar Grove and McArthur.
3. **Page: Homepage.** The line under the headline, the cabin row intro, the story band ("The crew behind your stay"), the co-hosting band and the Hocking Hills band.
4. **Page: About.** The headline and both roles ("Co-owner and host").
5. **Each cabin page.** The blurb, About this home, the 6 "Why you'll love it" tiles, the room list and bed types, amenities, "Before you arrive" notes and cabin FAQs. Also the main photo and the 4 beside it, which now match each Airbnb listing.
6. **"We typically reply within an hour"** shows on Contact, FAQs, About and Co-hosting. Still true for emails and forms, not only guest messages?
7. **The hero video's shots:** The Farm from the air, Rickenbacker Ridge's pool, the pickleball game at Pickle Hill, Loch Llyn's dock, Dunkle Creek's hot tub, Valhalla Hills' sunroom, Clouds Reach's fire pit. The pickleball shot shows people. OK to use?
8. **The review request message** in `docs/reviews.md`, before it goes into Hospitable.
9. **Logo on dark backgrounds:** "Hocking" and "STAYS" are cream, "Happy" stays mustard.

## 4. Waiting on the clients to send

| What | Where it goes when it arrives |
|---|---|
| Hospitable booking widget code, one per cabin | Pages CMS, **Cabins**, the cabin, **Hospitable booking widget code**. Paste exactly as given |
| Hospitable search widget code | Pages CMS, **Site settings**, **Hospitable search widget code** |
| Mailchimp signup embed code | Send to Cole. One web address from it goes in **Site settings** |
| Google Tag Manager ID (Natalie is creating the new Google accounts) | **Site settings**, **Google Tag Manager ID** |
| Natalie's About story | **Page: About**, **Our story** |
| Headshots and short bios for Natalie and Dave | **Page: About**, **Team** |
| Owner testimonials | **Page: Co-hosting**, **Owner testimonials**. The section appears once one is added |
| The checklist of what they handle for owners | Send to Cole. Replaces the drafted service cards |
| Her own FAQ list | **Page: FAQs** |
| 10 full-size photos, plus the missing Airbnb photos | Send to Cole. List in `docs/photos-to-resend.csv` |
| A photo of the Hocking Hills they own (a cave, a trail, a waterfall) | **Page: Homepage**, **Hocking Hills photo band**. It shows Loch Llyn's lake for now |

## 5. Build work left (new chat, repo attached)

1. **Move the 13 Wix blog posts** into `content/blog`, keeping each post's name from the old address. The redirects switch from temporary to permanent by themselves as each post lands. The list is in `docs/redirects.csv`.
2. **Drive times** for every cabin to Old Man's Cave, Ash Cave, Cedar Falls, Lake Logan and downtown Logan. Addresses are in the questionnaire, for lookups only. They never go on the site.
3. **Area map** on each cabin page. It's a labeled placeholder now.
4. **Swap in the full-size photos** when Natalie sends them: resize to 2400 px, keep the same file names.
5. **After the Hospitable widgets are pasted in:** check how they sit in their cards on a phone and on a computer. Never change the widget code itself.
6. **Share image:** the picture that shows when a link is texted or posted. It's a plain logo card now.
7. **Privacy page**, if the clients say yes.
8. **Delete the sample blog post** (`content/blog/sample-post.md`) once a real post is in. It hides itself at launch either way.
9. **SEO package** (separate from the build): keyword research, mapping keywords to pages, optimizing the 13 posts, new posts.

Not planned, flagged in case it comes up: separate pages for large groups, small groups and games. The Cabins page filters cover this and can be linked (`/cabins?group=large`).

## 6. Launch day

1. Confirm sections 1 to 4 are done and both clients have approved the site.
2. Refresh the Airbnb rating and review count in **Site settings**. Round the count down.
3. In Netlify, **Domain management**: add `happyhocking.com` and make it the primary domain. Natalie points DNS at Netlify from Hostinger, using the records Netlify shows.
4. Trigger one more deploy (**Deploys**, **Trigger deploy**). The site unblocks search engines by itself on the first deploy after happyhocking.com becomes primary. Ask in a chat to confirm the "noindex" tag is gone.
5. Follow `docs/redirects.md` to add the old Wix domain and happyhockingstays.com, so every old address lands on its new page.
6. In Google Search Console, add happyhocking.com, submit `https://happyhocking.com/sitemap.xml`, and use **Change of address** on the old site's property.
7. Natalie or Dave turn on the review request message in Hospitable (`docs/reviews.md`).
8. Send one last test through each form on the real domain.

## Decided, so nobody re-asks

- Top banner stays, one line.
- Hero photos follow each cabin's Airbnb listing.
- Owner fees and fit criteria are not published.
- Phoenix Landing, a cabin on the old site, redirects to `/cabins`.
- Reviews launch as comments only. Stars are a switch in Site settings.
- No mushroom or sun icons.
- The 57 smaller photos stay in use. Only the 10 lead photos were requested at full size.
