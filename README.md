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

Updated Nov 11, 2026. Every page in the first pass is built, and the 13 Wix blog posts are moved over. This is what's left before launch, grouped by who does it. Cross items off here as they're done.

## 1. Natalie and Cole: make the repo public, then set up Netlify

Nothing below can be tested until this is done.

Where things stand (Nov 11): Cole transferred this repo to Natalie's GitHub account, so it's now `happyhockingstays/happy-hocking-site`. Natalie owns the Netlify account (Free plan, 1 member only), and her site `animated-kheer-a8b74a.netlify.app` is linked to the empty `happyhocking-website` repo. On the Free plan, a private repo only deploys changes made by the owner, so this repo has to be public for Cole's and Claude's changes to go live. Nothing private is in it (checked Nov 11).

Natalie does steps 1 to 4, or Cole talks her through them on a screen share:

1. **Make the repo public.** On GitHub, open `happyhockingstays/happy-hocking-site`, **Settings**, scroll to **Danger Zone**, **Change visibility**, **Make public**.
2. **Give Netlify the repo.** On GitHub: profile picture, **Settings**, **Applications**, **Netlify**, **Configure**. Under **Repository access**, add `happy-hocking-site`, then **Save**.
3. **Point the site at it.** In Netlify, open the site, then **Project configuration**, **Build & deploy**, **Continuous deployment**, **Manage repository**, **Link to a different repository**, and pick `happy-hocking-site`. Leave the build settings alone. They come from `netlify.toml`. Then **Deploys**, **Trigger deploy**, **Deploy project**.
4. **Clean up and Pages CMS.** Delete the empty `happyhocking-website` repo. Then open app.pagescms.org, sign in with GitHub and give Pages CMS access to `happy-hocking-site` on the `happyhockingstays` account.

**Netlify credits.** The Free plan has 300 credits a month with a hard cap. Every production deploy costs 15, and that includes every save in Pages CMS. Bandwidth costs 20 per GB. Commits that only change notes (this README, `HANDOFF.md`, `AGENTS.md`, `docs/`) skip the deploy. Save edits in batches, and plan to move to the Personal plan (1,000 credits with top-ups) before launch.

5. Open `animated-kheer-a8b74a.netlify.app` and check 3 things: cabin photos load, the homepage video plays, and every page in the menu opens.
6. In Netlify, click **Forms** in the left menu. If it asks, click **Enable form detection**.
7. Redeploy once so Netlify finds the forms: **Deploys**, **Trigger deploy**, **Deploy project**.
8. Go to **Forms**, **Submission notifications**, **Add notification**, **Email notification**. Pick the form **review** and type the address that should get reviews. Save.
9. Repeat step 8 for **contact** (guest questions), **owner-inquiry** (co-hosting) and **insider-list** (email signups). Each can go to a different person. On the Free plan that's Natalie's login email, so she can forward or filter from there.
10. Send a test through each form on the Netlify address and confirm each email arrives:
   - `/review?cabin=pickle-hill` (check that Pickle Hill is already picked)
   - `/contact` with "A stay" picked
   - `/contact` with "Co-hosting" picked
   - `/co-hosting`, the form near the bottom
   - the insider list signup in the footer
11. Change one word in Pages CMS, save, and confirm the site updates in about 2 minutes.
12. In GitHub, open the repo's **Settings**, **Branches**, and add a rule for `main` that blocks force pushes and deletions. Don't require pull requests: Pages CMS saves straight to `main`.
13. Don't add happyhocking.com yet. That's launch day (section 6).

Steps 6 to 9 happen in Netlify, so Natalie does them or shares her screen. If anything in steps 5 to 11 fails, start a chat with the repo attached and say which step. These parts were built and tested locally but have never run on Netlify: form emails, the photo resizing service, and the new Pages CMS screens saving.

## 2. Questions for Natalie and Dave

Answered Nov 11:

- **Photos:** no larger originals exist. The small ones are her AI-enhanced edits, so they stay. Summer photos are the default; skip the fall photos at Dunkle Creek and The Johnny for now. The Valhalla Hills dusk photos can't be found.
- **Bedroom numbers:** they should match Airbnb, and she confirmed Dunkle Creek and Pickle Hill do. One thing to tell her: Pickle Hill's written Airbnb description calls Bedroom 4 the twins and Bedroom 5 the queen, the opposite of her photos and the site. The Airbnb text is the one to fix.
- **Old domains:** both are registered at GoDaddy in an account she doesn't control yet, not her Hostinger. hockinghills-cabinrentals.com runs on Wix's nameservers. hockinghills-hosting.com points at Squarespace and expires Feb 16, 2027. She's working on access. See section 6.
- **Access given to Cole:** GitHub, the 2 new domains (plus 2 unused ones), Google Search Console and Mailchimp (admin).
- **Google Business Profile:** Natalie is checking whether it can move to the new name, EIN and address. Nothing to do yet.

Still to ask:

1. **Old domains:** can she get into that GoDaddy account, or have both domains transferred to her Hostinger account? Either one has to happen before launch day.
2. **Pickle Hill fire pit photo** in Dropbox: worth adding, or skip since it's AI-enhanced?
3. **Hero video.** The homepage plays a 25-second clip made from their photos. Do they have real footage (drone or walkthrough) to replace it? If yes: 10 to 20 seconds, a wide cut and a tall cut, no sound.
4. **Who gets each email:** guest reviews, guest questions and co-hosting inquiries. One address or 3?
5. **Business email.** The site shows HockingHillsHosting@gmail.com until the new one exists. The same address should own the Netlify and GitHub accounts.
6. **Instagram.** The site links @HockingHillsHosting. They planned to rename it. Tell us when.
7. **Airbnb soundbites:** use short Airbnb review quotes or not? Nothing from Airbnb is on the site. If yes, they add each one under Reviews with Source set to Airbnb.
8. **Old co-hosting site.** Confirm hockinghills-hosting.com is being retired. The redirect to `/co-hosting` is built and does nothing until the domain points at Netlify.
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
10. **The 11 blog posts moved from Wix.** The words are hers, edited only to fit the brand rules (numerals, no serial commas, "booking-site fees", links to the new cabin pages). A few changes to check:
    - Facts fixed: pools are outdoor, not indoor; pool dates now read May 15 to October 15 (Clouds Reach April 15 to November 30); Dunkle Creek no longer claims Starlink; "intimate spaces for 2" became "cozy A-frames for a couple or a small family"
    - Added: Lazy Deer Retreat (newer than the posts) in 3 posts, and a short "Winter on the trails" tip list in the winter weekend post
    - Removed: the "Summer26" booking code from the spring and summer post
    - Retitled: 2 titles used banned phrases ("hidden gems", "perfect getaway"). The web addresses didn't change
    - The Wix posts used stock photos of people. Each post now uses the clients' own cabin photos
    - The 2 "2026 winter guide" posts were HTML boxes with no readable text, so they now point to the winter weekend post. If she has the text, they can come back
11. **Drive times** on each cabin page: Old Man's Cave, Ash Cave, Cedar Falls, Lake Logan and downtown Logan. Worked out from the addresses and rounded to 5 minutes, keeping her listing's number where it gave one. Dunkle Creek's address didn't look up exactly, so its times are close but worth a glance.
12. **Share image:** the picture that shows when a link is texted or posted. It's The Farm's pool with the logo card.

## 4. Waiting on the clients to send

| What | Where it goes when it arrives |
|---|---|
| Hospitable booking widget code, one per cabin | Pages CMS, **Cabins**, the cabin, **Hospitable booking widget code**. Paste exactly as given |
| Hospitable search widget code | Pages CMS, **Site settings**, **Hospitable search widget code** |
| Mailchimp signup embed code | Cole has admin access now, so he can get it: Mailchimp, **Audience**, **Signup forms**, **Embedded form**, copy the code and paste it in a chat. One web address from it goes in **Site settings** |
| Google Tag Manager ID (Natalie is creating the new Google accounts) | **Site settings**, **Google Tag Manager ID** |
| Natalie's About story | **Page: About**, **Our story** |
| Headshots and short bios for Natalie and Dave | **Page: About**, **Team** |
| Owner testimonials | **Page: Co-hosting**, **Owner testimonials**. The section appears once one is added |
| The checklist of what they handle for owners | Send to Cole. Replaces the drafted service cards |
| Her own FAQ list | **Page: FAQs** |
| A photo of the Hocking Hills they own (a cave, a trail, a waterfall) | **Page: Homepage**, **Hocking Hills photo band**. It shows Loch Llyn's lake for now |

## 5. Build work left (new chat, repo attached)

Done Nov 11: the 13 Wix posts (11 moved, 2 empty winter guides merged into the winter weekend post; all 34 old addresses now redirect permanently), drive times for every cabin, the share image, the sample post deleted, and the redirect for hockinghills-hosting.com.

1. **Area map** on each cabin page. It's a labeled placeholder now.
2. **After the Hospitable widgets are pasted in:** check how they sit in their cards on a phone and on a computer. Never change the widget code itself.
3. **Mailchimp:** wire the footer signup to Mailchimp once the embed code is in a chat.
4. **Privacy page**, if the clients say yes.
5. **Pickle Hill fire pit photo**, if Natalie wants it.
6. **SEO package** (separate from the build): keyword research, mapping keywords to pages, optimizing the 13 posts, new posts.

Not planned, flagged in case it comes up: separate pages for large groups, small groups and games. The Cabins page filters cover this and can be linked (`/cabins?group=large`).

## 6. Launch day

1. Confirm sections 1 to 4 are done and both clients have approved the site.
2. Refresh the Airbnb rating and review count in **Site settings**. Round the count down.
3. In Netlify, **Domain management**: add `happyhocking.com` and make it the primary domain. Natalie (or Cole, who now has access) points DNS at Netlify from Hostinger, using the records Netlify shows.
4. Trigger one more deploy (**Deploys**, **Trigger deploy**). The site unblocks search engines by itself on the first deploy after happyhocking.com becomes primary. Ask in a chat to confirm the "noindex" tag is gone.
5. Follow `docs/redirects.md` to add the old Wix domain, hockinghills-hosting.com and happyhockingstays.com, so every old address lands on its new page. The 2 old domains are in a GoDaddy account Natalie doesn't own yet (section 2), so sort out access well before this day.
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
- The 57 smaller photos stay in use. There are no larger originals (Natalie, Nov 11).
- Summer photos are the default. Fall photos at Dunkle Creek and The Johnny stay out for now.
- Bedroom numbers match Airbnb.
