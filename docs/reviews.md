# Guest reviews: how they work

Kept light on purpose. No app, no account for guests and nothing publishes by itself.

1. A day after checkout, Hospitable sends the guest a message with their review link.
2. The guest fills in the form at `happyhocking.com/review`.
3. Netlify emails the review to the hosts.
4. A host reads it and adds it under **Reviews** in Pages CMS. It shows on the cabin's page and the homepage at the next publish (Mondays and Thursdays, or sooner with **Publish the site** in GitHub Actions).

## The review form

- Lives at `/review`. It is not in the menu, not in the sitemap and hidden from search engines.
- `?cabin=` at the end of the link picks the cabin for the guest. Without it, the guest picks from a dropdown.
- Asks for: cabin, month of stay, overall rating, 6 detail ratings (cleanliness, accuracy, check-in, communication, location, value), the review, first name, email and a private note for the hosts.
- The email address is never shown. The private note is never published and never goes into the website's files. It only arrives in the email.
- Spam is filtered by Netlify, plus a hidden field that only bots fill in.

### Review links, one per cabin

| Cabin | Link |
|---|---|
| Valhalla Hills | `https://happyhocking.com/review?cabin=valhalla-hills` |
| Loch Llyn | `https://happyhocking.com/review?cabin=loch-llyn` |
| The Farm at Nickel Plate | `https://happyhocking.com/review?cabin=the-farm-at-nickel-plate` |
| Clouds Reach | `https://happyhocking.com/review?cabin=clouds-reach` |
| The Johnny | `https://happyhocking.com/review?cabin=the-johnny` |
| Rickenbacker Ridge | `https://happyhocking.com/review?cabin=rickenbacker-ridge` |
| Pickle Hill | `https://happyhocking.com/review?cabin=pickle-hill` |
| Lazy Deer Retreat | `https://happyhocking.com/review?cabin=lazy-deer-retreat` |
| Dunkle Creek | `https://happyhocking.com/review?cabin=dunkle-creek` |

A new cabin's link ends with the last part of its page address.

## The Hospitable message (for Natalie or Dave to set up)

Set it to send **1 day after checkout**, for **direct bookings only**. Guests who booked on Airbnb or VRBO review there.

Use Hospitable's own short codes for the guest's first name and the cabin name (pick them from the short-code menu in the message editor). Put that cabin's link from the table above in each cabin's version of the message.

> Hi [guest first name],
>
> Thanks for staying at [cabin name]. We hope you're home with a few good stories.
>
> Would you take 2 minutes to tell us how it went? Your review helps the next guest pick their cabin, and it helps us keep getting better.
>
> [review link for this cabin]
>
> Thanks again. We'd love to host you next time.
>
> Natalie and Dave
> Happy Hocking Stays

Shorter version for a text message:

> Hi [guest first name], thanks for staying at [cabin name]. Got 2 minutes to tell us how it went? [review link for this cabin]

## Getting the email (Cole, one time, in Netlify)

The address has to belong to someone on the Netlify team. Dave and Natalie own the Netlify account, so theirs work.

1. Open the site in Netlify and click **Forms** in the left menu.
2. If it asks, click **Enable form detection**, then redeploy the site once (**Deploys**, **Trigger deploy**, **Deploy site**).
3. Click **Submission notifications**, then **Add notification**, then **Email notification**.
4. For **Event to listen for**, choose **New form submission**.
5. Type the email address that should get the reviews.
6. For **Form**, choose **review**. Save.
7. Repeat steps 3 to 6 for **contact** (guest questions), **owner-inquiry** (co-hosting) and **insider-list** (email signups, until Mailchimp is connected). Each form can go to a different person.
8. Test it: open `/review` on the live site, send a test review and check that the email arrives. Do the same on `/contact` and `/co-hosting`.

Replying to a notification email replies to the guest, because the form includes their email address.

## Publishing a review (hosts, in Pages CMS)

1. Open **Reviews** and click **Add an entry**.
2. Pick the cabin. Type the first name only, the month and year ("Oct 2026"), and the review.
3. Copy the overall rating and the 6 detail ratings from the email.
4. Set **Source** to Direct. Leave **Published** on. Save.

Rules for what goes in:

- **Post every genuine review.** Only skip spam, profanity, personal info or a review from someone who didn't stay. Leaving out real reviews because they're critical breaks FTC rules.
- Fix nothing but obvious typos. Trim a long review with an ellipsis, and never change its meaning.
- First name only. Never a last name, email or phone number.
- Never copy the private note into Pages CMS.

## What shows on the site

- **At launch:** comments only, no stars. A cabin's review section and the homepage carousel stay hidden until that first review is published, so nothing looks empty.
- **Stars:** in **Site settings**, turn on **Show star ratings**. Each cabin name then gets a badge with its average, stars and review count, linking to its reviews. The average uses only published reviews that have an overall rating.
- **Airbnb soundbites:** still being decided by Dave and Natalie. Nothing from Airbnb is in the site. If they go ahead, they add each one under **Reviews** with **Source** set to Airbnb.
- The line "Every cabin rated 4.9+ on Airbnb" and the review count come from **Site settings**. Round the count down so it stays true, and refresh it every quarter.
