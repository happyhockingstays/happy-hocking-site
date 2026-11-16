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

Updated Nov 16, 2026 (eighth session, after Cole's call with Natalie). Every page in the first pass is built, the 13 Wix blog posts are moved over, and the 4 collection pages, the privacy page and a share image for every page are in (Nov 15). This is what's left before launch, grouped by who does it. Cross items off here as they're done.

## 1. Natalie, then Cole: GitHub and Netlify setup

Nothing below can be tested until this is done.

**Where things stand (checked Nov 15, seventh session):** mostly done. The repo is in Natalie's GitHub account (`happyhockingstays`) and is public, and Netlify is linked with `live` as the production branch and `main` as a branch deploy (steps 1 to 4 are done).

- **`main` builds.** Netlify's deploy list shows completed branch deploys of `main` for the #3, #4 and #5 merges. Netlify only posts GitHub checks on pull requests, which is why it looked like nothing built. A notes-only commit shows as "Failed" in that list ("Canceled build due to no content change"): that's the skip working, not an error.
- **The previews are open now (Nov 16).** Natalie turned off Netlify's team login ("visitor access") on Nov 16, so anyone with the link can see the preview and the live address. That's safe: search engines stay blocked until happyhocking.com is the primary domain. It also means Cole can run steps 9 to 12 without a Netlify invite.
- **No Netlify invite for Cole (Nov 16).** Natalie tried to add him as a Reviewer, but her plan's member screen wouldn't send the invite. It isn't needed: the Netlify-only launch steps (domain, forms check) happen on a screen share.
- **Publishing.** "Publish the site" last ran Nov 12, so the live branch is still pull request #1. It runs Mondays and Thursdays at 9:00 am Eastern and copies `main` to `live`. The next run (Monday, Nov 16) carries #3, #4 and #5. Search engines stay blocked until happyhocking.com is the primary domain, so that's safe.

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
7. ~~Invite Cole as a Reviewer.~~ **Dropped (Nov 16):** the invite wouldn't send on her plan, and it isn't needed now that the previews are open.
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

Also check, from the Nov 15 pull requests (#3, #4, #5):

- The 4 collection pages: photos load, the search card shows the Hospitable widget, and the table scrolls sideways on a phone
- A cabin page: the "area nearby" section shows drive times with no map
- A blog post: photos inside the post load (their addresses start with `/.netlify/images`)
- Share images: paste a cabin link and a post link into a text message or https://www.opengraph.xyz
- The footer signup: join with your own email and confirm it lands in Mailchimp
- Any made-up address shows the 404 page

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
14. **Day visitors at a reunion (new, Nov 15).** Can relatives who aren't staying overnight visit a cabin for the day? The family reunion posts play it safe: they say visitors need host approval (the house rule) and to hold that day's gathering at a park shelter house if more people are coming than the cabin sleeps. The family reunion ideas and group trip posts (pull request #8) say the same.
15. **Where they send guests first (new, Nov 15).** 2 lines are written in the hosts' voice: "It's the first place we point our guests to" (Old Man's Cave post) and "the trail we suggest for the first morning of a trip" (Ash Cave post). True, or would they say it differently?
16. **Photos of the trails (new, Nov 15; agreed Nov 16).** The trail guides lead with cabin photos, because the clients' photo set has no park photos. On the Nov 16 call Natalie preferred real photos over drawn illustrations and said she'd find them over time: Old Man's Cave, Ash Cave, Cedar Falls, Rock House, Cantwell Cliffs and Lake Logan first, then the Christmas, winter and fall posts. Her own photos are best. A photo whose license allows business use (Unsplash's does) is fine too, with a note of where it came from. Never one copied from a news site or a search result. She can swap each cover herself (steps in `docs/pages-cms-guide.md`); Cole refreshes the share image after.
17. **The 2 owner posts (new, Nov 16).** A few lines are in the hosts' voice and need their OK: "plenty of the owners we work with came to us while they were buying", "taxes are part of the reason a lot of the owners we work with bought" and the co-hosting description (booking payments go straight to the owner, "we bill you for our work", "you see every booking and every payout"). The same description is now an FAQ on the co-hosting page.
18. **Lodging tax (new, Nov 16).** Do they file the monthly Hocking County lodging tax for the owners they co-host for, or does each owner file? If they file it, the lodging tax post and the co-hosting page should say so: it's a real selling point.
19. **The logo on computers (new, Nov 16).** Natalie said the logo doesn't look smooth on her computer screen. The files are true vectors, but the shapes were traced from a picture, so the edges have small bumps that show at the size the header uses on a computer. A phone shows it too small to notice. Does she have the original logo file from whoever designed it (an .ai, .eps, .pdf or .svg from the designer, or a Canva export)? If not, a designer can redraw the outlines cleanly. The site only needs the new SVG files swapped in.

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
16. **The 12 newer posts (Nov 15, pull requests #7 to #11, once merged):** day trips from Columbus, things to do in Logan, how to plan a group trip, family reunion ideas, family reunion games, Cedar Falls, Rock House, weekend getaways in Ohio, day trips from Cincinnati, the weekend trip packing list, Cantwell Cliffs and Lake Logan State Park. Things to check:
    - **Packing list:** it says every cabin has towels, because every cabin lists "Essentials" on Airbnb (towels, sheets, soap and toilet paper). It also says most cabins have board games, an iron and a pack 'n play. True?
    - **Group and reunion posts:** the advice in the hosts' voice (plan 3 to 6 months out, split by bedroom, 1 meal per household, 1 shared thing a day)
    - **Things to do in Logan:** the downtown restaurants and shops come from the tourism association's list. Anything they'd add or drop?
    - **Cantwell Cliffs** uses the narrow passage's old name, the Fat Woman's Squeeze, recorded by state geologists in 1953. Keep it or cut it?
    - **Drive times:** 7 lines in older posts said the Hocking Hills are under 3 hours from Cleveland. They now say about 3.5 hours, per the tourism association
17. **The owner posts (new, Nov 16):** 5 in all. The 3 newest (pull request #13) are "Vacation rental co-hosting" (`/blog/vacation-rental-co-hosting`), "Short-term rental property management" (`/blog/short-term-rental-property-management`) and "Vacation rental cleaning" (`/blog/vacation-rental-cleaning`). In the cleaning post, check the turnover checklist against what their cleaners actually do, and the line that every home they host ends each stay with a full clean, the pool and hot tub checked and supplies restocked. In the co-hosting post, check that they invoice owners rather than taking a payout split. The first 2 are  "Buy a cabin in Ohio" (`/blog/buy-a-cabin-in-ohio`) and "Hocking County lodging tax" (`/blog/hocking-county-lodging-tax`), category **For owners**. Both are listed under "Owner guides" on the Co-hosting page, next to a new FAQ on how co-hosting differs from a property management company. The claims to confirm are question 17 in section 2.
18. **Card photos on hover (new, Nov 16):** on a computer, each cabin card now fades through 3 photos of what makes that cabin different, a new one every 2.5 seconds, then back to the cover when the pointer leaves. The Farm's card now starts on an outside shot instead of the basketball court. She can change all of them in Pages CMS (**Card photo** and **Card photos on hover** on each cabin). The picks: Clouds Reach bocce, fire pit and sunroom; Dunkle Creek A-frame living room, hot tub and fire pit; Lazy Deer sport court, hot tub and game room; Loch Llyn from the air, the pool and the stone fireplace; Pickle Hill 2 pickleball shots and the sauna; Rickenbacker Ridge the yard, hot tub and poker table; The Farm the sports barn, game room and pool; The Johnny the pool, fire pit and mural; Valhalla Hills the pool, sauna and great room.

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

Done Nov 15 (pull request #3, merged): the 4 collection pages, the privacy page, share images for every page, the 404 page and the "direct costs less" edit from pull request #2, and these fixes: filtered views of the Cabins page are out of the sitemap, photos inside posts go through the image service and reserve their space, share tags carry the image size, and the homepage has WebSite schema. The map placeholder on cabin pages is gone (Cole, Nov 15): the section keeps the town note and drive times.

1. **Hospitable widgets (pasted in Nov 15):** all 9 booking widgets, the search bar (homepage, Cabins page and the 4 collection pages) and the search results page at `/search` (noindex, out of the sitemap). On the preview, check how they sit in their cards on a phone and on a computer, and run one search from dates to booking. Never change the widget code itself.
   - Hospitable's optional "Step 3" script (pass search dates to the booking widget) is left out on purpose. Its booking loader already copies checkin, checkout and guest counts from the page address into the booking widget, and the pasted script would add them a second time.
   - The property URLs in Hospitable are a launch-day step (section 6), not now.
   - Tested Nov 16: all 9 booking widgets load, a search runs from the homepage to `/search` to a cabin page with the dates and price carried over.
   - **Natalie, in Hospitable:** add Lazy Deer Retreat to the property search. It's missing from search results (8 of 9 show). Its booking widget works.
   - **Natalie, in Hospitable (agreed on the Nov 16 call):** the search results show each property's Airbnb-style title ("Fall Cabin - sleeps 16 | HOT TUB | Firepit | POND"). If Hospitable lets her set a public name for the Direct channel only, use the plain cabin names there and keep the Airbnb titles on Airbnb. The search widget's colors are set in Hospitable, not the site, and they clash with the brand. Use Terracotta Deep `#A8452A` for the search button (with white or Cream `#F9F3E7` text) and Forest `#1F3D2E` for any other accent. If she'd rather Cole do it, she gives him Hospitable access.
2. **Mailchimp.** 2 separate things:
   - **Footer signup:** wired up (Nov 15). The form address is in **Site settings**, **Mailchimp form address**. The signup keeps the site's own design and posts to Mailchimp, which opens its confirmation page in a new tab. Test it once on a preview with a real address.
   - **Pop-up form:** Cole duplicated the clients' pop-up for happyhocking.com, restyled it in the brand colors with the logo and set its page rules (Nov 15). It now shows after 30 seconds instead of 2. On a phone, one element of the pop-up covered its buttons, and Mailchimp wouldn't remove it for phones only, so Cole deleted it on both (Natalie OK'd, Nov 16). A pop-up has no embed code: it shows through the "connected site" script that's already on every page, once happyhocking.com is live and Mailchimp verifies it. It won't show on a preview address.
3. **Pickle Hill fire pit photo**, if Natalie wants it.
4. **Share images** are files, not part of the build. After adding a page or a post, or changing a cabin's main photo or a post's cover, run `python3 scripts/make-share-images.py` (in a chat with the repo attached). A page without one falls back to its own photo.
5. **SEO package** (separate from the build). Keyword research and the IA are done (Lookout, client slug `hh-5cbs23`). The on-page pass for every page already in the repo is done (Nov 12), and the 4 collection pages are built (Nov 15). Left:
   - The new Wave 1 posts, in the IA's publish order. 19 of 31 are written. Merged: Christmas cabin rentals, Christmas getaway ideas, family reunion venues, Old Man's Cave and Ash Cave (#4), cabins in Columbus, Ohio and Logan, Ohio cabins (#5). Open (Nov 15): day trips from Columbus and things to do in Logan (#7), how to plan a group trip, family reunion ideas and family reunion games (#8), Cedar Falls and Rock House (#9), weekend getaways in Ohio, day trips from Cincinnati and the weekend trip packing list (#10), Cantwell Cliffs and Lake Logan State Park (#11). Next: week 6 (P045 cabins in Ohio, P036 cabin rentals with hot tub, P013 cabins with pools in Ohio, P056 Lake Hope State Park, P057 John Glenn Astronomy Park), then weeks 7 and 8. Launch goes out with everything that's written (Cole, Nov 15)
   - Pull requests #6 to #11 merged Nov 15. The links between them were switched on in pull request #12 (Nov 16): 13 mentions in 8 posts. Still unlinked until their pages exist: Lake Hope State Park (P056), Tar Hollow State Park (P059) and John Glenn Astronomy Park (P057)
   - **Event dates:** pull request #6 adds this season's dates (Holidays in Ash Cave, Saturday, December 12, 2026, 3:00 to 5:00 pm; the Winter Hike, Saturday, January 16, 2027). After January, swap in next season's dates once the park posts them on its events calendar
   - **Owner posts, part 2 (Nov 16, pull request #13):** 3 more, from owner topics the IA had left off: `/blog/vacation-rental-co-hosting` (P128), `/blog/short-term-rental-property-management` (P129) and `/blog/vacation-rental-cleaning` (P130). New Page IDs, added to the IA as version 1.2 (Cole runs the Quadratic edits). That makes 24 new posts written plus the 9 old ones optimized
   - **Owner posts (Nov 16):** Natalie explained on the call that winning owners matters more to the business than any single booking, so the IA's 2 owner posts were written ahead of their waves: `/blog/hocking-county-lodging-tax` (P116, was Wave 2) and `/blog/buy-a-cabin-in-ohio` (P117, was Wave 3). They're category **For owners** and listed on the Co-hosting page. Still to size, with a SEMrush pull Cole runs: short-term rental tax strategy (Natalie's "2.0")
   - Each new post follows `docs/blog-writing.md`, and its pull request adds links from 2 or 3 older posts
   - When a new post is created in Pages CMS, set its file name to the IA's slug (the seed, no year), not the title
   - Mark each shipped page Done on the IA's Cluster map. The list of 23 pages (11 merged, 12 in open pull requests) and every other IA edit owed from Nov 15 is in the Claude project doc `claude/seo-ia-pending-changes.md`

The Cabins page filters can still be linked (`/cabins?group=large`), but copy should link the collection pages instead.

## 6. Launch day

1. Confirm sections 1 to 4 are done and both clients have approved the site.
2. Refresh the Airbnb rating and review count in **Site settings**. Round the count down.
3. In Netlify, check that the live site is open to everyone. Natalie turned the team login off on Nov 16, so this should already be true: open the live address in a private browser window to be sure.
4. In Netlify, **Domain management**: add `happyhocking.com` and make it the primary domain. Natalie (or Cole, who now has access) points DNS at Netlify from Hostinger, using the records Netlify shows.
5. Natalie triggers one more deploy (**Deploys**, **Trigger deploy**). The site unblocks search engines by itself on the first live deploy after happyhocking.com becomes primary. The preview never does. Ask in a chat to confirm the "noindex" tag is gone. Then, in Mailchimp, finish connecting happyhocking.com (the site script is already on every page).
6. Follow `docs/redirects.md` to add the old Wix domain, hockinghills-hosting.com and happyhockingstays.com, so every old address lands on its new page. The 2 old domains are in a GoDaddy account Natalie doesn't own yet (section 2), so sort out access well before this day.
7. In Google Search Console, add happyhocking.com, submit `https://happyhocking.com/sitemap.xml`, and use **Change of address** on the old site's property.
8. Natalie or Dave turn on the review request message in Hospitable (`docs/reviews.md`).
9. **Hospitable property URLs:** in Hospitable, **Direct**, the live Direct site, then the property list. Paste each cabin's page into its **URL** field (for example `https://happyhocking.com/cabins/valhalla-hills`). Search results send guests to this address, and Google Vacation Rentals uses it. Hospitable checks that the page loads over https with the matching booking widget, so it only passes once the new site is live.
10. Send one last test through each form on the real domain.

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
- Blog covers stay real photos, not drawn illustrations. Natalie finds park photos over time and swaps them in (Nov 16).
- Cabin cards start on an outside photo and fade through 3 to 5 more on hover, about every 2.5 seconds. Phones keep the one photo (Nov 16).
- No Netlify invite for Cole. Netlify-only steps happen on a screen share (Nov 16).
