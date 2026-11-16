# Editing the site in Pages CMS

Notes for the Loom walkthrough and the training call. Written for Dave and Natalie.

## Check a change before it goes live

There's no draft button for page edits. The preview site is your draft.

1. Make the change in Pages CMS and click **Save**.
2. Wait about 2 minutes, then open the preview site: https://main--animated-kheer-a8b74a.netlify.app. Find the page you changed and check it. If it isn't there yet, wait a minute and refresh.
3. Something wrong? Fix it in Pages CMS and save again. Nothing reaches the real site yet.
4. The real site picks up everything you've saved on Mondays and Thursdays at 9:00 am Eastern.

Need something live sooner, like a rule or a price? Text Cole, or publish it yourself: on GitHub, open the repo, click **Actions**, then **Publish the site**, then **Run workflow**. Each publish uses a little of the free Netlify plan, so save it for things that can't wait.

Nothing is ever lost: every version is kept, and Cole can undo any change.

Blog posts are the one exception: they have a **Draft** switch of their own (see "Write a blog post").

## Fields to leave alone

Most fields are yours to change any time. These few are set for Google search or for bookings, and the note under each one says so:

- **Google title** and **Google description** on cabins, posts and the collection pages
- **About this home, heading** on cabins
- A post's **Title** and **Summary** on posts Cole wrote: they start with the search phrase the post targets
- The headlines and link wording on the 4 collection pages
- **Hospitable booking widget code** on cabins, and the 2 Hospitable codes in **Site settings**

If one of them needs to change, text Cole and he'll rework it so it keeps its search phrase. Updating the Airbnb rating and review count in **Site settings** is fine, and should happen every few months.

## Change words on a cabin page

1. Go to app.pagescms.org and open the site.
2. Click **Cabins**, then the cabin.
3. Edit the field. Each one has a short note under it saying where it shows.
4. Click **Save**.

## Swap a photo

Resize the photo first (next section), then:

1. Open the cabin in **Cabins**.
2. Find the photo: **Hero photo**, **Four key shots**, **Why you'll love it**, **Where everyone sleeps** or **Photo gallery**.
3. Click the photo, then **Upload** or pick one already on the site.
4. Fill in the **Photo description**: what it shows, plus the cabin name.
5. Click **Save**.

In the gallery, photos stay in their category groups. Drag a photo to reorder it inside its group, or drag a whole group to move the category. Every gallery photo needs a caption like "Bedroom 2 · Queen".

## Resize a photo before uploading (Mac)

Full-size photos slow the site down, so shrink them to 2400 pixels wide first.

1. Open the photo in **Preview**.
2. In the menu bar, click **Tools**, then **Adjust Size**.
3. Set **Width** to **2400** pixels. Keep "Scale proportionally" checked.
4. Click **OK**.
5. Click **File**, then **Export**. Choose **JPEG**, set Quality about three-quarters of the way up and save.
6. Name it in lowercase with hyphens, like `pickle-hill-pool-013.jpg`.

## Card photos on hover

On a computer, pointing at a cabin's card (on the Cabins page, the homepage and the collection pages) fades through a few more photos of that cabin, a new one every 2.5 seconds. Phones show the card photo only.

1. Open the cabin in **Cabins**.
2. **Card photo (optional)** is the photo the card starts on. Leave it blank to use the hero photo. Use an outside shot of the home.
3. **Card photos on hover** holds 3 to 5 photos. Lead with what makes the cabin different: the court at Pickle Hill, the lake at Loch Llyn. Drag them into the order you want.
4. Give each a **Photo description**, then click **Save**.

## Hide or add a cabin

- **Hide:** open the cabin, turn on **Hide this cabin from the site** and save. Its page and cards disappear. Turn it off to bring it back.
- **Add:** a new cabin touches a few places beyond its own page: Hospitable, photos, the collection pages and the FAQs. The full checklist is in `docs/adding-a-cabin.md`. The short version: send Cole the Airbnb link, the Dropbox folder of photos and the Hospitable widget code, and he'll build the page in one go. You review it on the preview site before it goes live.

## Hospitable widget code

Paste it in exactly as given. Never change anything inside it. Each cabin has **Hospitable booking widget code**, and **Site settings** has the search widget.

## Change words or photos on the main pages

The Homepage, Co-hosting, About and FAQs each have their own screen: **Page: Homepage** and so on.

1. Open the page's screen.
2. Open the section you want, for example **Story band**.
3. Edit the words or swap the photo, then click **Save**.

A few sections hide themselves when they're empty: the homepage story band, the owner testimonials, and anything to do with reviews. Fill them in and they appear.

The big headlines that are brand lines ("A place for everyone in the Hocking Hills", "Find your happy place", "Happy to help") are fixed, so they can't be changed by accident.

## The 4 cabin collection pages

These group cabins by what a guest is after: pools, large groups, game rooms and luxury. They're linked from the footer and the Cabins page.

1. Click **Cabin collection pages** and open one.
2. Change the opening lines, the points in the dark green section or the questions, then **Save**.
3. To add or remove a cabin, open **Cabins on this page**. The line under each cabin says why it's on the page.

Sleeps, bedrooms, towns and pool dates fill themselves in from each cabin, so change those on the cabin, not here. Please don't rename these pages, and check with Cole before changing a headline or the link wording: they carry the search phrases.

## Add or edit an FAQ

1. Open **Page: FAQs**, then the group, for example **Your stay**.
2. Click **Add an entry**, or open a question to edit it.
3. Turn on **Show on the homepage** for the few that should also show there. About 6 is plenty.
4. Click **Save**.

Questions about one cabin go on that cabin instead: **Cabins**, the cabin, **Questions about this cabin**.

## Write a blog post

1. Open **Blog posts** and click **Add an entry**.
2. Type the title. The web address is made from it the first time you save, and stays the same after that.
3. Add the summary, date, category and a cover photo (resized to 2400 pixels wide), with its description. Posts written for homeowners go under the category **For owners**, which also lists them on the Co-hosting page.
4. Write the post. Use the toolbar for headings, lists, links and photos. Link each cabin's name to its page the first time it comes up.
5. Leave **Draft** on while you work. Turn it off and save to publish.

A draft shows only on the preview site. Once happyhocking.com is live, drafts stay hidden until you publish them.

## Swap a blog post's cover photo

Many posts about the parks (Old Man's Cave, Ash Cave, Cedar Falls and the rest) use one of our cabin photos for now, because we don't own photos of the parks yet. Swap them in as you find better ones.

1. Use a photo you took, or one whose license allows use on a business website (Unsplash's license does, for example). Keep a note of where it came from. Never use a photo copied from a news site, another company's site or a Google search: photographers do send invoices for those.
2. Resize it to 2400 pixels wide (steps above).
3. Open the post in **Blog posts**, click the **Cover photo**, remove the old one and upload the new one.
4. Update the **Cover photo description**: what the photo shows and where, for example "Ash Cave's waterfall in winter".
5. Click **Save**, then text Cole so he can refresh the post's share image (the picture that shows when the link is texted).

## Add an owner testimonial

Open **Page: Co-hosting**, then **Owner testimonials**, and click **Add an entry**. The section appears on the page once that first testimonial is in. Only post what the owner has agreed to share.

## Reviews and the star-rating switch

When a guest's review arrives by email:

1. Open **Reviews** and click **Add an entry**.
2. Pick the cabin. Type the first name only, the month and year ("Oct 2026"), and the review.
3. Copy the ratings from the email. Set **Source** to Direct and save.

Post every genuine review. Only skip spam, profanity, personal info or a review from someone who didn't stay. Never copy the guest's private note into Pages CMS.

Stars stay hidden until **Show star ratings** is turned on in **Site settings**. The full walkthrough, the review links for each cabin and the Hospitable message are in `docs/reviews.md`.
