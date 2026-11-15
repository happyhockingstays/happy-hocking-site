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
npm run links      # after a build: broken links, link wording that points at 2 pages, orphans
npm run posts      # blog posts against the keyword plan (docs/blog-seeds.csv)
```

Node 22+.

## How editing works

- **Pages CMS** (app.pagescms.org) is the clients' editing window. `.pages.yml` defines what they see: Cabins, Reviews, the main pages, Blog posts, Site settings and Policies. Saving updates the preview site (https://main--animated-kheer-a8b74a.netlify.app) in about 2 minutes. The live site picks up saved changes when it's published (below).
- **GitHub** keeps every version. Anything can be undone.
- **Netlify** builds 2 copies: `main` as a free preview, and `live` as the real site. **Publish the site** in GitHub Actions copies `main` to `live` on Mondays and Thursdays, or right away when someone clicks **Run workflow**. This keeps the site on Netlify's Free plan (see the punch list).
- **Hospitable** stays separate and handles bookings. Its widget code is pasted into Pages CMS and never edited.

Plain-language steps for the clients are in `docs/pages-cms-guide.md`.

## Where things live

| What | File |
|---|---|
| Cabin content (words, facts, photos, FAQs, widget code) | `content/cabins/*.yml` |
| Site settings and shared policies | `content/settings/*.yml` |
| Homepage, Co-hosting, About and FAQs copy | `content/pages/*.yml` |
| Blog posts (markdown, the file name is the URL) | `content/blog/*.md` |
| Cabin collection pages (pools, large groups, game rooms, luxury) | `content/collections/*.yml`, one template in `src/pages/CollectionPage.tsx` |
| Privacy page | `content/pages/privacy.yml` |
| Share images, one per page (made by `scripts/make-share-images.py`) | `public/images/share/` |
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

Updated Nov 15, 2026. Every page in the first pass is built, the 13 Wix blog posts are moved over, and the 4 collection pages, the privacy page and a share image for every page are in (Nov 15). This is what's left before launch, grouped by who does it. Cross items off here as they're done.

## 1. Natalie, then Cole: GitHub and Netlify setup

Nothing below can be tested until this is done.

**Where things stand (Nov 15):** done. The repo is in Natalie's GitHub account (`happyhockingstays`) and is public, Cole is a Reviewer on her Netlify team, and Netlify is linked: it built a deploy preview for pull requests #3 and #4 on Nov 15 (`deploy-preview-3--animated-kheer-a8b74a.netlify.app`). Still to confirm in Netlify: the production branch is `live`, `main` is a branch deploy, and form emails are on (steps 4 to 6). The first commit to `main` after the link will show whether the `main` preview builds.

**Natalie's part** (Cole can walk her through it on a screen share):

1. Accept the GitHub transfer email.
2. Make `happy-hocking-site` public: repo **Settings**, **Danger Zone**, **Change visibility**, **Make public**. On Netlify's Free plan, a private repo only goes live with the owner's changes.
3. Give 3 tools access to the repo:
   - **Netlify:** github.com/settings/installations, **Configure** next to Netlify, add `happy-hocking-site`, **Save**
   - **Pages CMS:** app.pagescms.org, sign in with GitHub, install it on `happyhockingstays` for `happy-hocking-site`
   - **Claude** (how Cole updates the site): github.com/apps/claude/installations/select_target, pick `happyhockingstays`, **Only select repositories**, `happy-hocking-site`, **Install**
4. In Netlify, open the site, then **Project configuration**, **Developer settings** (tab along the top):
   - **Repository** (left menu): **Manage repository**, **Link to a different repository**, pick `happy-hocking-site`. Leave the build settings alone. They come from `netlify.toml`
   - **Branches and deploy contexts** (left menu): **Configure**. Production branch: `live`. Branch deploys: **Let me add individual branches**, add `main`. **Save**
5. In Netlify, click **Forms**, then **Enable form detection**. Then **Deploys**, **Trigger deploy**, **Deploy project**, so the first build picks up the forms.
6. Form emails: in the left menu, **Forms**, then the **Submission notifications** tab, **Add notification**, **Email notification**. Form: **Any form**. Email: the business address. **Save**.
7. Invite Cole as a **Reviewer** (free on every plan), so he can see the site while it's locked to the team: **Team settings**, **Members**, **Invite members**.
8. Delete the empty `happyhocking-website` repo (its **Settings**, **Danger Zone**).

**Cole's part, once she's done:**

9. Open the preview, https://main--animated-kheer-a8b74a.netlify.app, and check: cabin photos load, the homepage video plays, every menu page opens. If it says the page isn't found, the preview hasn't built yet: save any small change in Pages CMS, wait 2 minutes and try again.
10. Send a test through each form on the preview and confirm Natalie gets each email:
   - `/review?cabin=pickle-hill` (check that Pickle Hill is already picked)
   - `/contact` with "A stay" picked
   - `/contact` with "Co-hosting" picked
   - `/co-hosting`, the form near the bottom
   - the insider list signup in the footer
11. Change one word in Pages CMS, save, and confirm the preview updates in about 2 minutes.
12. Then run **Publish the site** once (GitHub, the repo, **Actions**, **Publish the site**, **Run workflow**) and check the live address picks up the change.
13. Don't add happyhocking.com yet. That's launch day (section 6).

If anything in steps 9 to 12 fails, start a chat with the repo attached and say which step. These parts were built and tested locally but have never run on Netlify: form emails, the photo resizing service and Pages CMS saving.

**Staying on the Free plan.** Free is 300 credits a month with a hard cap. Every live deploy costs 15 and bandwidth costs 20 per GB. Previews, failed deploys and form submissions are free. So:

- Everyday work goes to `main`, which only rebuilds the free preview.
- **Publish the site** copies `main` to `live` on Mondays and Thursdays, only if something changed. That's about 9 live deploys a month at most, or 135 credits. Click **Run workflow** for anything urgent.
- Commits that only change notes (this README, `HANDOFF.md`, `AGENTS.md`, `docs/`) don't build at all.
- The hero video was re-encoded smaller (2.8 MB wide, 1.6 MB tall) because bandwidth is the other big cost.
- After launch, check usage in Netlify (**Team settings**, **Usage**) once a month. If live traffic passes about 6 GB a month, publish less often or move to Personal (1,000 credits, with top-ups).

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
10. **Privacy policy.** Built on Nov 15 at `/privacy` and linked in the footer (Cole's OK). It's a plain-language draft, not legal advice: it names Hospitable, Netlify, Mailchimp and Google, and says information isn't sold. Natalie and Dave should read it, and have their attorney look if they want one to. Editable in Pages CMS under **Page: Privacy**.
11. **Accounts.** GitHub and Netlify should end up in accounts they own. The repo is in Cole's GitHub for now. When do they want the handover?
12. **Answered Nov 12 (Cole): direct is cheaper than Airbnb, no numbers yet. The book-direct post now says booking direct costs less. If they share actual rates, add a worked example.** Background: Since Sept 15, 2026, Airbnb charges US hosts a single fee (about 15.5%) and shows guests no separate service fee at checkout. Vrbo still adds a traveler fee. "Book direct and skip the booking-site service fees" is still true, but is the direct nightly rate actually lower than Airbnb's? The posts were written so they're true either way. If direct is cheaper, the book-direct post can say so with numbers.
13. **Christmas at the cabins (new, Nov 15).** Are any cabins decorated for Christmas, and can guests bring a tree or their own decorations? The Christmas cabin rentals post says nothing either way. If the answer is yes, it's worth a line in the post and a question under it.
14. **Day visitors at a reunion (new, Nov 15).** Can relatives who aren't staying overnight visit a cabin for the day? The family reunion venues post plays it safe: it says to hold that day's gathering at a park shelter house if more people are coming than the cabin sleeps.
15. **Where they send guests first (new, Nov 15).** 2 lines are written in the hosts' voice: "It's the first place we point our guests to" (Old Man's Cave post) and "the trail we suggest for the first morning of a trip" (Ash Cave post). True, or would they say it differently?
16. **A photo of Old Man's Cave and one of Ash Cave (new, Nov 15).** Both trail guides lead with a cabin photo, because the clients' photo set has no park photos. One of each, taken by them, would help both posts.

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
10. **The 9 blog posts, rewritten for search on Nov 12.** Each old post now targets one search phrase from the keyword research and lives at a new address named for it (old addresses redirect). The fall foliage post merged into the fall weekend post, and the "explore" post merged into the things-to-do post. Her sections and voice are kept where they fit, with new sections where the topic needed them (the family reunion post is now a full planning guide) and 3 to 5 questions under each post. Bachelorette and birthday trips, weddings, elopements and company retreats came out (the events rule). Worth her read before launch.
11. **Earlier notes on the posts moved from Wix.** The words are hers, edited only to fit the brand rules (numerals, no serial commas, "booking-site fees", links to the new cabin pages). A few changes to check:
    - Facts fixed: pools are outdoor, not indoor; pool dates now read May 15 to October 15 (Clouds Reach April 15 to November 30); Dunkle Creek no longer claims Starlink; "intimate spaces for 2" became "cozy A-frames for a couple or a small family"
    - Added: Lazy Deer Retreat (newer than the posts) in 3 posts, and a short "Winter on the trails" tip list in the winter weekend post
    - Removed: the "Summer26" booking code from the spring and summer post
    - Retitled: 2 titles used banned phrases ("hidden gems", "perfect getaway"). The web addresses changed later, on Nov 12 (item 10)
    - The Wix posts used stock photos of people. Each post now uses the clients' own cabin photos
    - The 2 "2026 winter guide" posts were HTML boxes with no readable text, so they now point to the winter weekend post. If she has the text, they can come back
12. **Drive times** on each cabin page: Old Man's Cave, Ash Cave, Cedar Falls, Lake Logan and downtown Logan. Worked out from the addresses and rounded to 5 minutes, keeping her listing's number where it gave one. Dunkle Creek's address didn't look up exactly, so its times are close but worth a glance.
13. **Share images:** the picture that shows when a link is texted or posted. Every page now has its own (Nov 15): the page's photo with the logo card, the cabin name or page headline and one short line.
14. **The 4 collection pages (new, Nov 15):** cabins with pools, cabin rentals for large groups, cabins with game rooms and luxury cabins. Each has an opening, a cabin list with a line on why each cabin is there, 6 "what to know" points and 5 or 6 questions. Things to check: the luxury page shows 6 cabins (Valhalla Hills, Loch Llyn, Clouds Reach, Rickenbacker Ridge, Lazy Deer Retreat, Pickle Hill); the large group page says parties, weddings and events aren't allowed; the pool page says hot tubs seat 4 to 8 and stay open all year. Editable in Pages CMS under **Cabin collection pages**.
15. **The 5 new posts (Nov 15):** Christmas cabin rentals, Christmas getaway ideas, family reunion venues, Old Man's Cave and Ash Cave. The 4 things only the hosts can answer about them are questions 13 to 16 in section 2.

## 4. Waiting on the clients to send

| What | Where it goes when it arrives |
|---|---|
| Google Tag Manager ID (Natalie is creating the new Google accounts) | **Site settings**, **Google Tag Manager ID** |
| Natalie's About story | **Page: About**, **Our story** |
| Short bios for Natalie and Dave, and larger versions of the 2 team photos (the ones sent are under 600 px) | **Page: About**, **Team**, and **Page: Homepage**, story band. Both headshots and the team photo are in (Nov 11) |
| Owner testimonials | **Page: Co-hosting**, **Owner testimonials**. The section appears once one is added |
| The checklist of what they handle for owners | Send to Cole. Replaces the drafted service cards |
| Her own FAQ list | **Page: FAQs** |
| A photo of the Hocking Hills they own (a cave, a trail, a waterfall) | **Page: Homepage**, **Hocking Hills photo band**. It shows Loch Llyn's lake for now |

## 5. Build work left (new chat, repo attached)

Done Nov 11: the 13 Wix posts (11 moved, 2 empty winter guides merged into the winter weekend post; all 34 old addresses now redirect permanently), drive times for every cabin, the share image, the sample post deleted, and the redirect for hockinghills-hosting.com.

Done Nov 15 (pull request "Pre-launch pass"): the 4 collection pages, the privacy page, share images for every page, the 404 page and the "direct costs less" edit from pull request #2, and these fixes: filtered views of the Cabins page are out of the sitemap, photos inside posts go through the image service and reserve their space, share tags carry the image size, and the homepage has WebSite schema. The map placeholder on cabin pages is gone (Cole, Nov 15): the section keeps the town note and drive times.

1. **Hospitable widgets (pasted in Nov 15):** all 9 booking widgets, the search bar (homepage, Cabins page and the 4 collection pages) and the search results page at `/search` (noindex, out of the sitemap). On the preview, check how they sit in their cards on a phone and on a computer, and run one search from dates to booking. Never change the widget code itself.
   - Hospitable's optional "Step 3" script (pass search dates to the booking widget) is left out on purpose. Its booking loader already copies checkin, checkout and guest counts from the page address into the booking widget, and the pasted script would add them a second time.
   - **Natalie, in Hospitable:** set each property's direct URL to its cabin page on happyhocking.com (for example `https://happyhocking.com/cabins/valhalla-hills`). Search results send guests there. Before launch they can point at the preview address instead.
2. **Mailchimp.** 2 separate things:
   - **Footer signup:** wired up (Nov 15). The form address is in **Site settings**, **Mailchimp form address**. The signup keeps the site's own design and posts to Mailchimp, which opens its confirmation page in a new tab. Test it once on a preview with a real address.
   - **Pop-up form:** Cole duplicated the clients' pop-up for happyhocking.com, restyled it and set its page rules (Nov 15). A pop-up has no embed code: it shows through the "connected site" script that's already on every page, once happyhocking.com is live and Mailchimp verifies it. It won't show on a preview address.
3. **Pickle Hill fire pit photo**, if Natalie wants it.
4. **Share images** are files, not part of the build. After adding a page or a post, or changing a cabin's main photo or a post's cover, run `python3 scripts/make-share-images.py` (in a chat with the repo attached). A page without one falls back to its own photo.
5. **SEO package** (separate from the build). Keyword research and the IA are done (Lookout, client slug `hh-5cbs23`). The on-page pass for every page already in the repo is done (Nov 12), and the 4 collection pages are built (Nov 15). Left:
   - The new Wave 1 posts, in the IA's publish order. 5 of 31 are written (Nov 15, pull request "Wave 1, weeks 1 and 2"): Christmas cabin rentals, Christmas getaway ideas, family reunion venues, Old Man's Cave and Ash Cave. Next is week 3: day trips from Columbus, cabins near Columbus, cabins in Logan and things to do in Logan. Launch goes out with everything that's written (Cole, Nov 15)
   - Each new post follows `docs/blog-writing.md`, and its pull request adds links from 2 or 3 older posts
   - When a new post is created in Pages CMS, set its file name to the IA's slug (the seed, no year), not the title
   - Mark each shipped page Done on the IA's Cluster map and republish Lookout (waiting on Quadratic, which was down on Nov 15)

The Cabins page filters can still be linked (`/cabins?group=large`), but copy should link the collection pages instead.

## 6. Launch day

1. Confirm sections 1 to 4 are done and both clients have approved the site.
2. Refresh the Airbnb rating and review count in **Site settings**. Round the count down.
3. In Netlify, **Domain management**: add `happyhocking.com` and make it the primary domain. Natalie (or Cole, who now has access) points DNS at Netlify from Hostinger, using the records Netlify shows.
4. Natalie triggers one more deploy (**Deploys**, **Trigger deploy**). The site unblocks search engines by itself on the first live deploy after happyhocking.com becomes primary. The preview never does. Ask in a chat to confirm the "noindex" tag is gone. Then, in Mailchimp, finish connecting happyhocking.com (the site script is already on every page).
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
- No area map on cabin pages. The town note and drive times stay (Cole, Nov 15).
- Share images: photo plus the logo card on every page. Posts show their title (Cole, Nov 15).
- Launch goes out with every post that's written, not 5 a week (Cole, Nov 15).
- The 57 smaller photos stay in use. There are no larger originals (Natalie, Nov 11).
- Summer photos are the default. Fall photos at Dunkle Creek and The Johnny stay out for now.
- Bedroom numbers match Airbnb.
