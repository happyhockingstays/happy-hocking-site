# Tracking: Google Tag Manager and GA4

Set up 2026-11-23, the same way as WentDirect (`cole-stark/wentdirect`, `docs/tracking/README.md`) and section 8.6 of Cole's website playbook.

- Cole created the GTM container and the GA4 property in his own Google account on 2026-11-23. Natalie becomes an Administrator on both when the site moves to the clients (step 5 below). The clients own them from then on, with Cole kept as an admin.
- GTM container `GTM-MNB9PCPW`. Its ID lives in Site settings (`gtmId` in `content/settings/site.yml`). The GA4 measurement ID lives only in GTM and in the import file below.
- GA4 is linked to the GTM container, so the container's own Google tag loads GA4 and sends page views. Never add a separate Google Tag for the same ID (GTM flags it as "Conflicting Google tag"), and never add gtag.js to the site, or every visit counts twice.

## How GTM is installed

`src/routes/__root.tsx` adds 2 inline scripts at the top of `<head>`: the consent defaults, then Google's install code from the container (the new style: `gtm.js` loaded async, then `gtag('js', new Date())`, with no noscript iframe). The install code creates the `gtm.js` script tag itself instead of writing `<script async src>`, because React moves async script tags to the top of `<head>`, ahead of the consent defaults. Tested: GTM starts with the consent defaults already in the dataLayer.

## When GTM loads

Only on the real site: a production build on happyhocking.com (`VITE_TRACKING` in `vite.config.ts`, the same check that lets search engines in). The free preview on `main`, the netlify.app address and local builds never load GTM, so test saves and the clients' own reviews never reach GA4. It turns itself on with the first publish after happyhocking.com becomes the primary domain in Netlify.

To test a build on your own machine: `TRACKING=true npm run build`, then `npm run serve`.

## What the site does and what GTM does

Clicks are tracked inside GTM with link-click triggers. The site only marks where a click happened, with `data-track` attributes. Form results are pushed by the site (`src/lib/track.ts`, `src/components/Forms.tsx`, `src/components/ContactForms.tsx`), because GTM can't tell whether a form went through.

No personal details ever go into the dataLayer: no names, emails, phone numbers, dates or messages.

## Events

| Event | Sent by | When | Parameters | GA4 key event |
|---|---|---|---|---|
| `generate_lead` | Site | The guest contact form or the co-hosting form is accepted by Netlify | `form_name` (`contact`, `owner_inquiry`), `lead_type` (`guest`, `owner`), `cabin` (the cabin picked on the guest form, if any) | Yes, the main one |
| `newsletter_signup` | Site | Insider list signup sent (footer and blog posts) | `form_name` = `insider_list` | Yes, secondary |
| `form_start` | Site | First typing or choice in one of those 3 forms, once per form per page | `form_name` | No |
| `book_click` | GTM | Any link to `/cabins` or to a cabin page's `#book` card: Check availability, Book now, the Cabins menu link | `cta_location`, `link_text`, `link_url` | No |
| `cabin_click` | GTM | Any link to a cabin page (cabin cards, links in posts) | `cabin` (from the address), `cta_location`, `link_url` | No |
| `cohost_click` | GTM | Any link to `/co-hosting` | `cta_location`, `link_text`, `link_url` | No |
| `contact_click` | GTM | A phone or email link | `contact_method` (`phone`, `email`), `cta_location` | No |
| `privacy_choice_update` | Site | Advertising cookies turned on or off on `/privacy#choices` | `ads_allowed` | No (not sent to GA4) |

`generate_lead` is one event for both audiences on purpose. Filter on `lead_type` to split guests from owners, or ignore it for one lead total.

The insider list posts to Mailchimp in a new tab, so the site can't see Mailchimp's answer. `newsletter_signup` counts a sent form there. Before a Mailchimp address is set it saves to Netlify Forms, and the event waits for Netlify's OK.

Every GA4 event also sends `page_type`, and the container's Google tag sends it as `content_group` (set in its settings), from the `RT - page_type` table on Page Path: `home`, `cabins_index`, `cabin`, `collection`, `search`, `cohosting`, `contact`, `blog_index`, `post`, `company` (about, FAQs, privacy), `review`, `other`.

**Bookings aren't tracked here.** They happen inside the Hospitable widget, which the site never edits. GA4's outbound-click tracking may catch the step out to Hospitable's checkout, and Hospitable may have its own Google Analytics setting. Both still need checking on the live site (README punch list).

## `data-track` values

`CJS - cta_location` reads the nearest wrapper with `data-track`. Anything else reports `page_body`.

`navbar` (header), `mobile_menu`, `mobile_bar` (the pinned bar on phones), `hero` (homepage and co-hosting page), `booking_card` (the Hospitable card on a cabin page), `closing_cta` (the Mustard band at the foot of most pages), `footer`.

- To track a new section, add `data-track="name"` to its wrapper and list it here.
- Never call `event.stopPropagation()` on link clicks. GTM listens on the whole page.

## Consent

`src/routes/__root.tsx` sets Google Consent Mode defaults before GTM loads. `ad_storage`, `ad_user_data` and `ad_personalization` are `denied` when the browser sends Global Privacy Control or the cookie `hh_ads_optout=1` is set, and `granted` otherwise. `analytics_storage` is always `granted` (disclosed on `/privacy`).

The switch is on `/privacy#choices` (`src/pages/PrivacyPage.tsx`). It sets `hh_ads_optout=1` on `.happyhocking.com` for a year. The privacy page says GA4 keeps visit statistics for 14 months, so keep GA4's data retention at 14 months.

Before adding any non-Google tag (Meta, Microsoft, Pinterest) to the container, update `/privacy` first and set the tag to require `ad_storage` (Advanced Settings > Consent Settings). The Google Ads tag in the import already requires it.

## The GTM import file

`docs/tracking/happyhocking-gtm.json`, written by `python3 scripts/gtm-container.py GTM-XXXXXXX G-XXXXXXXXXX`: 9 tags, 7 triggers, 8 variables.

- No Google Tag (see above). `content_group` is added to the container's own Google tag by hand, in step 2.
- GA4 event tags for the 7 events GA4 receives.
- Conversion Linker, on All Pages.
- Google Ads - Lead: paused, with placeholder IDs, until the clients run ads. To fill it in, edit the tag in GTM, or run the script again with `AW-<id>/<label>` at the end and import again.

After any change made in GTM's own screens, export the container and replace the file, so this copy stays current.

## Steps for Cole

### 1. Import the container (about 5 minutes, any time)

1. Download `docs/tracking/happyhocking-gtm.json` from GitHub (open the file, then the download button).
2. In GTM, open the happyhocking.com container, then Admin > Import Container.
3. Choose the file. Workspace: Existing, Default Workspace. Option: Merge, "Rename conflicting tags, triggers, and variables". Confirm.
4. Open the container's Google tag settings and add the configuration parameter `content_group` with the value `{{RT - page_type}}`.
5. Don't publish yet. Publishing waits for launch (step 4).

### 2. GA4 settings (about 10 minutes, any time)

1. Admin > Data retention: set event data to 14 months. The default is 2 months, and `/privacy` says 14.
2. Admin > Custom definitions > Create custom dimension, event scope, one each: `form_name`, `lead_type`, `cabin`, `cta_location`, `contact_method`, `page_type`. The parameter list is empty until events arrive, so type each name in.
3. Admin > Data streams > the web stream > Enhanced measurement > gear: turn off "Form interactions", because the site sends its own form events. Leave page views (including "Page changes based on browser history events", which counts page changes on this site), scrolls, outbound clicks and file downloads on.
4. Same stream > Configure tag settings > Define internal traffic: add your IP and the clients' office or home IPs as `internal`. Then Admin > Data filters: set the Internal Traffic filter to Active.
5. Admin > Data collection: turn on Google signals. Keep Reporting identity on Blended. Leave user-provided data collection off.

### 3. Before launch

1. Make sure `gtmId` is set in Site settings. It does nothing until launch.
2. Ask the clients for the IPs in step 2.4 if you haven't.

### 4. Launch day, after happyhocking.com is the primary domain and the site has been published once

1. In GTM, click Preview and enter https://happyhocking.com. Check that exactly 1 Google tag fires on Initialization.
2. Still in Preview: send the guest contact form and the co-hosting form once each (tell the clients the test emails are coming), join the insider list, click Check availability, a cabin card, Co-host with us and the phone link. Each should show its GA4 tag as fired.
3. Submit in GTM, name the version "v1: GA4 and lead events" and Publish.
4. In GA4 (Admin > Events, or Key events): mark `generate_lead` and `newsletter_signup` as key events. They show up once each has fired once.
5. Admin > Product links > Search Console links: link the happyhocking.com property once it's verified.
6. 1 week later: check the key events show in reports and the custom dimensions are filling in.

### 5. Hand it to the clients (at the GitHub and Netlify transfer)

1. GTM: Admin > User Management at the account level: add the clients' business Google account as Administrator, with Publish on the container.
2. GA4: Admin > Account access management: add the same account as Administrator.
3. Keep yourself on both as an admin for reporting and SEO work. The clients can remove you at any time.

Menu names change. Copy labels from the screen, not from here.

## Google Ads, later

Only when the clients run ads (they plan to). Link Google Ads to GA4, create a "Submit lead form" conversion action, put its ID and label into the paused Google Ads - Lead tag, and add a line to `/privacy` saying ads may be shown to past visitors before turning on remarketing. Use either the Google Ads tag or GA4 key events imported into Ads as the primary conversion, never both, or every lead counts twice. Full steps: playbook section 8.6.

## Email and hand-posted links

- Mailchimp campaigns: turn on Mailchimp's Google Analytics link tracking (UTMs) in each campaign's settings, so email visits count as Email, not Direct.
- Links posted by hand (Instagram bio, partner sites, printed QR codes for guests) get lowercase UTMs: `utm_source` is the site (`instagram`), `utm_medium` is `social`, `referral`, `email` or `print`, `utm_campaign` is short (`bio_link`).
