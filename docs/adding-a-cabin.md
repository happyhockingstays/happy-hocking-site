# Adding a new cabin

Everything a new cabin touches, in order. Written for Natalie and Dave, with the parts Cole (or a chat with this repo attached) does marked. The 9 cabins on the site now were all built this way.

**The short version:** send Cole the cabin's Airbnb link, the Dropbox folder of photos and its Hospitable booking widget code. He builds the page from a copy of an existing cabin, you review it on the preview site, and it goes live with the next publish. Plan on about a week from "here are the photos" to live, most of it waiting on review.

## 1. Before anything goes on the site (Natalie or Dave)

1. **Hospitable:** set up the property and copy its **booking widget** code.
2. **Hospitable search:** add the new property to the Direct search widget, so it shows in search results on the site. (Lazy Deer Retreat was left out of search at first, so check this one.)
3. **Hospitable public name:** if Hospitable lets you set a name for the Direct channel, use the cabin's plain name, not the Airbnb listing title.
4. **Photos:** organize them in Dropbox the same way as the others: one folder per category (Exterior, Pool, Bedrooms and so on), with file names like `Johnny_Bedroom_2_003`. Summer photos first.
5. **Hocking County registration number**, if the home is in Hocking County. It goes on the cabin page.
6. **The basics:** town, sleeps, bedrooms, beds, baths, pool dates and whether the pool is heated, hot tub size, check-out time if it differs, any extra house rules, and anything a guest should know before arriving (stairs, a steep drive, spotty cell service).

## 2. Building the page (Cole)

1. **Photos:** resized to 2400 px, renamed to the site's pattern (`new-cabin-pool-001.jpg`), grouped by category, each with a caption and a description. A whole cabin is about 80 photos, so this is done in bulk in a chat, not one at a time in Pages CMS.
2. **The cabin file:** a copy of the closest existing cabin in `content/cabins/`, then rewritten from the Airbnb listing and Natalie's notes: tagline ("A place to ___"), card line, chips, blurb, About this home, the 6 "Why you'll love it" tiles, rooms and beds, amenities, drive times, before-you-arrive notes and 3 to 5 cabin FAQs.
3. **Hero, key shots, card photo and card photos on hover:** the hero and 4 key shots match the Airbnb listing's lead photos. The card starts on an outside shot and cycles through 3 to 5 photos of what makes the cabin different.
4. **Booking widget:** pasted into the cabin exactly as Hospitable gives it.
5. **Search:** the cabin gets a seed keyword from the keyword research (Cole's IA file), which goes into its Google title, Google description and About heading. Cole adds the page to the IA and Lookout.
6. **A heated pool:** if the new cabin's pool is heated, its name is added to the copy check (`scripts/check.mjs`), which otherwise flags the word "heated" on any cabin but Clouds Reach and Rickenbacker Ridge.
7. **Share image:** `python3 scripts/make-share-images.py cabins-<slug>`.
8. **Checks:** `npm run check`, `npm run typecheck`, `npm run build`, `npm run links`.

Keep **Hide this cabin from the site** turned on while the page is being built if it might sit half-done over a Monday or Thursday publish. A hidden cabin has no page at all, even on the preview, so turn it off for the review in step 3.

## 3. What updates by itself

Once the cabin is saved and visible:

- Its own page at `/cabins/<slug>`
- Its card on the Cabins page (with the group-size and games filters) and in the homepage cabin row
- The sitemap, so Google finds it
- The search results page, once Hospitable includes it (step 1.2)

## 4. What needs a hand update (Cole, with Natalie's OK)

These list cabins by name, so a new one has to be added:

- **The 4 collection pages** (Pages CMS, **Cabin collection pages**, **Cabins on this page**): the pools page takes every cabin. The large groups page takes it if it sleeps 10 or more. The game rooms page takes it if it has a game room, a pool table or a court. The luxury page is a judgment call.
- **The FAQ "Which cabin is right for my group?"** (Pages CMS, **Page: FAQs**, **Choosing a cabin**): add the cabin to the right list.
- **Similar cabins** on 1 or 2 other cabins, so the new one gets linked from them.
- **Blog posts** that list cabins by group size or feature (the large group, reunion, pool and pickleball posts). A chat can find and update them: "add <cabin> to every post that lists cabins it fits".
- **The hero video**, only if the new cabin should be in it. It's made from photos by `scripts/make-hero-video.py`.

## 5. Review and launch (Natalie, then Cole)

1. Natalie reads the page on the preview site (https://main--animated-kheer-a8b74a.netlify.app/cabins/<slug>) and corrects anything in Pages CMS.
2. Cole checks the booking widget on the preview: pick dates and get as far as the price.
3. It goes live with the next Monday or Thursday publish, or right away with **Run workflow** (see `docs/pages-cms-guide.md`).
4. **Hospitable property URL:** once it's live, paste the cabin's page address (`https://happyhocking.com/cabins/<slug>`) into the property's **URL** field in Hospitable's Direct settings.
5. If the cabin had a page on the old Wix site, add a row to `docs/redirects.csv` so the old address lands on the new page.

## Removing a cabin

Turn on **Hide this cabin from the site** (Pages CMS, the cabin). Its page and cards disappear and nothing is deleted. Then take it out of the collection pages and the FAQ answer, and ask Cole to add a redirect from its old page to `/cabins` so links to it don't break.
