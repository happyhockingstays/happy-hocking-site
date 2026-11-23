# Tracking: Google Tag Manager and GA4

Set up 2026-11-23, the same way as WentDirect (`cole-stark/wentdirect`, `docs/tracking/README.md`) and section 8.6 of Cole's website playbook, with one change: **every kind of conversion has its own event, trigger and tag** (Cole, Nov 23). Guest questions, co-hosting inquiries and bookings are different audiences and intents, so none of them share an event.

- Cole created the GTM container and the GA4 property in his own Google account on 2026-11-23. Natalie becomes an Administrator on both when the site moves to the clients (step 6 below). The clients own them from then on, with Cole kept as an admin.
- GTM container `GTM-MNB9PCPW`. Its ID lives in Site settings (`gtmId` in `content/settings/site.yml`). The GA4 measurement ID, `G-P9ZPMEE9TJ`, lives only in GTM and in the import file below.
- GA4 was not linked to the GTM container when the property was made (GA4 didn't offer it), so the container has its own Google Tag, "Google Tag - GA4", which loads GA4 and sends page views. Never link GA4 to the container later as well: GTM would flag a "Conflicting Google tag" and page views would count twice (if it happens, see the gotcha at the end). Never add gtag.js to the site either.
- Bookings are tracked by Hospitable, which loads the same GTM container in its booking flow once the GTM ID is in Hospitable (step 3).

## How GTM is installed

`src/routes/__root.tsx` adds 2 inline scripts at the top of `<head>`: the consent defaults, then Google's install code from the container (the new style: `gtm.js` loaded async, then `gtag('js', new Date())`, with no noscript iframe). The install code creates the `gtm.js` script tag itself instead of writing `<script async src>`, because React moves async script tags to the top of `<head>`, ahead of the consent defaults. Tested: GTM starts with the consent defaults already in the dataLayer.

## When GTM loads

Only on the real site: a production build on happyhocking.com (`VITE_TRACKING` in `vite.config.ts`, the same check that lets search engines in). The free preview on `main`, the netlify.app address and local builds never load GTM, so test saves and the clients' own reviews never reach GA4. It turns itself on with the first publish after happyhocking.com becomes the primary domain in Netlify.

To test a build on your own machine: `TRACKING=true npm run build`, then `npm run serve`.

## Who sends what

- **This site** pushes form results (`src/lib/track.ts`, `src/components/Forms.tsx`, `src/components/ContactForms.tsx`), because GTM can't tell whether a form went through.
- **GTM** tracks clicks with link-click triggers. The site only marks where a click happened, with `data-track` attributes.
- **Hospitable** sends the booking events from inside its booking widget and its checkout at booking.hospitable.com. The site can't see inside the widget (it's a frame from another domain) and never edits it.

No personal details ever go into the dataLayer from this site: no names, emails, phone numbers, dates or messages.

## Conversions

Each has its own event, its own GTM trigger and its own GA4 tag.

| Event | Sent by | When | Parameters | GA4 key event |
|---|---|---|---|---|
| `purchase` | Hospitable | A guest finishes a booking in Hospitable's checkout (whether a booking request counts isn't stated by Hospitable) | Hospitable's ecommerce data: value, currency, the cabin, the stay dates, guests | Yes, the most important. GA4 marks it as a key event by itself |
| `begin_checkout` | Hospitable | A guest picks dates in a cabin's booking widget and clicks Reserve, which starts Hospitable's checkout | The same ecommerce data | Yes, primary |
| `guest_inquiry` | Site | The guest contact form (`/contact`) is accepted by Netlify | `form_name` = `contact`, `cabin` (the cabin picked, if any) | Yes, primary |
| `cohost_inquiry` | Site | The co-hosting form (on `/co-hosting` and behind the Contact page's owner choice) is accepted by Netlify | `form_name` = `owner_inquiry` | Yes, primary |
| `newsletter_signup` | Site | The site's insider list form is sent (footer, and the blog page when it has no posts) | `form_name` = `insider_list`, `signup_location` (`footer`, `blog`) | Yes, secondary |

The insider list posts to Mailchimp in a new tab, so the site can't see Mailchimp's answer. `newsletter_signup` counts a sent form there. Before a Mailchimp address is set it saves to Netlify Forms, and the event waits for Netlify's OK.

**The Mailchimp pop-up isn't counted yet.** Mailchimp draws it with its own script, and it only appears on happyhocking.com once Mailchimp has verified the domain, so it can't be inspected before launch. On launch day, check whether its form is part of the page (then the site can count it as `newsletter_signup` with `signup_location` = `popup`, a small follow-up) or sits in a frame from Mailchimp (then GA4 can't see it, and Mailchimp's own form report counts it).

## Other events

| Event | Sent by | When | Parameters |
|---|---|---|---|
| `view_item` | Hospitable | A guest views a cabin in Hospitable's booking flow | Ecommerce data |
| `add_to_cart` | Hospitable | A guest picks dates and gets a price | Ecommerce data |
| `add_payment_info` | Hospitable | A guest reaches the payment step | Ecommerce data |
| `form_start` | Site | First typing or choice in one of the 3 forms, once per form per page | `form_name` (`contact`, `owner_inquiry`, `insider_list`) |
| `book_click` | GTM | Any link to `/cabins` or to a cabin page's `#book` card: Check availability, Book now, the Cabins menu link | `cta_location`, `link_text`, `link_url` |
| `cabin_click` | GTM | Any link to a cabin page (cabin cards, links in posts) | `cabin` (from the address), `cta_location`, `link_url` |
| `cohost_click` | GTM | Any link to `/co-hosting` | `cta_location`, `link_text`, `link_url` |
| `phone_click` | GTM | A phone link | `cta_location` |
| `email_click` | GTM | An email link | `cta_location` |
| `privacy_choice_update` | Site | Advertising cookies turned on or off on `/privacy#choices` | `ads_allowed` (not sent to GA4) |

`form_start` is the one event shared by all 3 forms. It isn't a conversion, and `form_name` tells them apart. `phone_click` and `email_click` can be marked as key events too, if calls and emails should count as conversions.

Every GA4 event also sends `page_type`, and the Google tag sends it as `content_group`, from the `RT - page_type` table on the hostname and path: `booking` (Hospitable's pages), `home`, `cabins_index`, `cabin`, `collection`, `search`, `cohosting`, `contact`, `blog_index`, `post`, `company` (about, FAQs, privacy), `review`, `other`.

## Bookings: how the Hospitable events work

Hospitable's help center ("Direct booking flow analytics") says its Direct widgets work with Google Tag Manager on self-hosted sites like this one. With a GTM ID in Hospitable's Marketing settings, Hospitable loads the container in its booking flow and sends 5 ecommerce events: View Item, Add to Cart, Begin Checkout, Add Payment Info and Purchase, each with the booking value, currency, property, stay dates and guest count. The checkout runs on booking.hospitable.com, so GA4 needs cross-domain tracking (step 2.6) or bookings show up as Direct traffic.

What isn't known until it runs on the live site, because Hospitable's article gives display names only:

- **The exact event names.** The container listens for the standard GA4 names (`view_item`, `add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`). Check them in GTM Preview on launch day. If Hospitable uses other names, change the 5 `CE -` triggers in `scripts/gtm-container.py` and import again.
- **Whether Hospitable sends them as dataLayer events or as gtag commands.** As dataLayer events, the 5 GA4 tags send them. As gtag commands, the Google tag sends them straight to GA4 and the 5 tags never fire. Either way they reach GA4, and nothing is counted twice.
- **Whether the Reserve click is `begin_checkout`.** Hospitable describes Begin Checkout as "Guest starts the booking process", which is the Reserve click. Confirm it in Preview.
- **Page views inside the widget.** If Hospitable loads the container inside the booking widget's frame on a cabin page, the Google tag skips its page view there (`CJS - send page view`), so the cabin page isn't counted twice. Events from the frame still send.
- **Consent.** booking.hospitable.com can't read this site's ad-cookie choice (it's another domain). Hospitable's own consent handling decides there.

## `data-track` values

`CJS - cta_location` reads the nearest wrapper with `data-track`. Anything else reports `page_body`.

`navbar` (header), `mobile_menu`, `mobile_bar` (the pinned bar on phones), `hero` (homepage and co-hosting page), `booking_card` (the Hospitable card on a cabin page), `closing_cta` (the Mustard band at the foot of most pages), `footer`.

- To track a new section, add `data-track="name"` to its wrapper and list it here.
- Never call `event.stopPropagation()` on link clicks. GTM listens on the whole page.

## Consent

`src/routes/__root.tsx` sets Google Consent Mode defaults before GTM loads. `ad_storage`, `ad_user_data` and `ad_personalization` are `denied` when the browser sends Global Privacy Control or the cookie `hh_ads_optout=1` is set, and `granted` otherwise. `analytics_storage` is always `granted` (disclosed on `/privacy`).

The switch is on `/privacy#choices` (`src/pages/PrivacyPage.tsx`). It sets `hh_ads_optout=1` on `.happyhocking.com` for a year. The privacy page says GA4 keeps visit statistics for 14 months, so keep GA4's data retention at 14 months.

Before adding any non-Google tag (Meta, Microsoft, Pinterest) to the container, update `/privacy` first and set the tag to require `ad_storage` (Advanced Settings > Consent Settings). The Google Ads tags in the import already require it.

## The GTM import file

`docs/tracking/happyhocking-gtm.json`, written by `python3 scripts/gtm-container.py GTM-MNB9PCPW G-P9ZPMEE9TJ`: 20 tags, 14 triggers, 11 variables.

- Google Tag - GA4, on Initialization - All Pages, with `content_group` = `{{RT - page_type}}` and `send_page_view` = `{{CJS - send page view}}`.
- 15 GA4 event tags, one per event above (all but `privacy_choice_update`), each on its own trigger. The 5 Hospitable tags send ecommerce data from the data layer.
- Conversion Linker, on All Pages.
- 4 Google Ads conversion tags, paused with placeholder IDs until the clients run ads: Booking (`purchase`, with the booking value), Reserve click (`begin_checkout`), Guest inquiry and Co-host inquiry. Each conversion action gets its own label: run the script again with `--ads AW-<id> --label-purchase <label> --label-begin-checkout <label> --label-guest <label> --label-cohost <label>` and import again.

After any change made in GTM's own screens, export the container and replace the file, so this copy stays current.

## Steps for Cole

Menu names change. Copy labels from the screen, not from here.

### 1. Import the new container file (about 5 minutes)

The Nov 23 file replaces the first one, which grouped both forms as `generate_lead`. Nothing has been published, so replace the whole workspace.

1. Download `docs/tracking/happyhocking-gtm.json` from GitHub (open the file, then the download button).
2. In GTM, open the happyhocking.com container, then Admin > Import Container.
3. Choose the file. Workspace: Existing, Default Workspace. Option: **Overwrite**, not Merge. Overwrite replaces everything in the workspace with the file, so the old `generate_lead` tag and trigger go away. Merge would leave them in place beside the new ones.
4. Before confirming, GTM shows how many tags, triggers and variables it will add, change and delete. Expect 20 tags, 14 triggers and 11 variables in the end.
5. After the import, open GA4 - purchase and check "Send Ecommerce data" is ticked with Data Layer as the source. Same for the other 4 Hospitable tags.
6. Don't publish yet. Publishing waits for launch (step 5).

### 2. GA4 settings (about 10 minutes, any time)

1. Admin > Data retention: set event data to 14 months. The default is 2 months, and `/privacy` says 14.
2. Admin > Custom definitions > Create custom dimension, event scope, one each: `form_name`, `cabin`, `signup_location`, `cta_location`, `page_type`. The parameter list is empty until events arrive, so type each name in. The booking events' value, cabin and dates land in GA4's ecommerce reports without custom dimensions.
3. Admin > Data streams > the web stream > Enhanced measurement > gear: turn off "Form interactions", because the site sends its own form events. Leave page views (including "Page changes based on browser history events", which counts page changes on this site), scrolls, outbound clicks and file downloads on.
4. Same stream > Configure tag settings > Define internal traffic: add your IP and the clients' office or home IPs as `internal`. Then Admin > Data filters: set the Internal Traffic filter to Active.
5. Admin > Data collection: turn on Google signals. Keep Reporting identity on Blended. Leave user-provided data collection off.
6. Same stream > Configure tag settings > Configure your domains: add `happyhocking.com` and `booking.hospitable.com`, so a guest who books keeps the source they arrived from. This is Hospitable's own instruction.

### 3. The GTM ID in Hospitable (Natalie, or Cole with her Hospitable login, about 2 minutes)

1. In Hospitable: Direct, then the self-hosted site whose widgets are on this site, then its Marketing tab.
2. Paste `GTM-MNB9PCPW` into the Google Tag Manager ID field. Leave the Google Analytics ID field empty: GA4 already loads through GTM, and both would count bookings twice.
3. Save, and republish the site in Hospitable if it asks.

It's safe to do any time. GTM sends nothing until the container is published on launch day.

### 4. Before launch

1. Make sure `gtmId` is set in Site settings. It does nothing until launch.
2. Ask the clients for the IPs in step 2.4 if you haven't.

### 5. Launch day, after happyhocking.com is the primary domain and the site has been published once

1. In GTM, click Preview and enter https://happyhocking.com. Check that exactly 1 Google tag fires on Initialization.
2. Still in Preview: send the guest contact form and the co-hosting form once each (tell the clients the test emails are coming), join the insider list, and click Check availability, a cabin card, Co-host with us, the phone link and the email link. Each should fire its own GA4 tag.
3. On a cabin page, pick dates in the booking widget and click Reserve. In Preview, look for `add_to_cart` and `begin_checkout`, and note their exact names. Stop before paying. A finished test booking is the only way to see `purchase`, so leave that for the first real booking, or ask the clients whether they can make and cancel a test booking.
4. Open the Mailchimp pop-up and check whether its form is in the page or in a Mailchimp frame (see Conversions above).
5. Submit in GTM, name the version "v1: GA4, inquiries and bookings" and Publish.
6. In GA4 (Admin > Events, or Key events): mark `begin_checkout`, `guest_inquiry`, `cohost_inquiry` and `newsletter_signup` as key events. `purchase` is one already. Each shows up once it has fired once.
7. Admin > Product links > Search Console links: link the happyhocking.com property once it's verified.
8. 1 week later: check the key events show in reports, the custom dimensions are filling in and bookings show a source other than Direct.

### 6. Hand it to the clients (at the GitHub and Netlify transfer)

1. GTM: Admin > User Management at the account level: add the clients' business Google account as Administrator, with Publish on the container.
2. GA4: Admin > Account access management: add the same account as Administrator.
3. Keep yourself on both as an admin for reporting and SEO work. The clients can remove you at any time.

## Google Ads, later

Only when the clients run ads (they plan to).

1. Link Google Ads to GA4. Leave auto-tagging on.
2. Create one conversion action per conversion: Booking (with value, primary), Reserve click (secondary, so it doesn't steer bidding beside Booking), Guest inquiry and Co-host inquiry. Co-hosting is a different audience, so its campaigns optimize for Co-host inquiry, not bookings.
3. Rerun the script with the account ID and the 4 labels, import, Preview and Publish.
4. Use either the Google Ads tags or GA4 key events imported into Ads, never both, or every conversion counts twice.
5. Before remarketing, add a line to `/privacy` saying ads may be shown to past visitors.

## Gotcha: "Conflicting Google tag"

GTM shows this if GA4 also gets linked to the container in GA4's own settings, so 2 things load GA4 and page views count twice. Fix: click Consolidate, then delete one of the 2 Google tags left on Initialization, keeping the one that sends `content_group`. Next time the import file is made, add `--linked` so it leaves its Google Tag out.

## Email and hand-posted links

- Mailchimp campaigns: turn on Mailchimp's Google Analytics link tracking (UTMs) in each campaign's settings, so email visits count as Email, not Direct.
- Links posted by hand (Instagram bio, partner sites, printed QR codes for guests) get lowercase UTMs: `utm_source` is the site (`instagram`), `utm_medium` is `social`, `referral`, `email` or `print`, `utm_campaign` is short (`bio_link`).

## Sources

- Hospitable help center, [Direct booking flow analytics](https://help.hospitable.com/en/articles/9877398-direct-booking-flow-analytics), read 2026-11-23: GTM and GA support on self-hosted widget sites, the 5 ecommerce events, where the IDs go and the booking.hospitable.com cross-domain step.
