# Redirects from the old Wix site

Every page on hockinghills-cabinrentals.com has a new home on happyhocking.com, so Google rankings and old links carry over. The map is `docs/redirects.csv`. The build turns it into the redirect rules Netlify uses (`scripts/postbuild.mjs` writes `_redirects`), so edit the CSV, never the rules.

The old URLs came from the live Wix sitemap on Nov 9, 2026: 16 pages, 13 blog posts and 5 blog categories.

## What goes where

- The 8 old cabin pages go to their new cabin pages. `/cloudsreach` and `/new-dunkle-creek` change names. `/dunkle-creek` and the leftover `/valhallacopy` go to their cabins too (added Nov 12 from the IA's redirect map).
- `/properties` and its leftover copy go to `/cabins`. `/contact-us` and the old `/lead-collection` form go to `/contact`. `/faqs` stays `/faqs`.
- `/sign-up-insider-list` goes to the signup in the footer.
- Each blog post goes from `/post/its-name` to `/blog/its-keyword`. On Nov 12 the posts moved to keyword slugs (the IA's slug rule, open question 10), and 2 pairs merged: the fall foliage post into `/blog/fall-weekend-getaways` and the "explore" post into `/blog/things-to-do-in-hocking-hills-for-adults`. Every old Wix address points straight at the new slug, with no chains.
- The posts' first addresses on this site (`/blog/its-old-name`, only ever on the preview) redirect to the new slugs too. They're the rows marked `renamed` in the CSV, and they work on happyhocking.com itself.
- Blog category pages go to `/blog`.
- Anything not on the list goes to the same address on happyhocking.com, which shows the 404 page (`/404`, prerendered to `404.html`). Never the homepage: Google reads a homepage fallback as a soft 404 (Cole, Nov 12).
- happyhockingstays.com forwards to happyhocking.com, page for page.

## Open questions

1. **Phoenix Landing** has a page on the old site and isn't on the new one. It points to `/cabins`. Cole OK'd this on Nov 9.
2. **Blog posts:** all moved over on Nov 11, so every post redirect is permanent. The 2 "2026 winter guide" posts were Wix HTML boxes with no readable text, so both old addresses go to `/blog/cabins-for-winter`.
3. **hockinghills-hosting.com**, the old co-hosting site, sends every page to `/co-hosting`. This is set in `scripts/postbuild.mjs`, not the CSV, because the whole domain goes to one page.

## Where the old domains live (Nov 11)

Both are registered at GoDaddy in an account the clients don't control yet, not Natalie's Hostinger.

- hockinghills-cabinrentals.com uses Wix's nameservers (`ns12.wixdns.net`, `ns13.wixdns.net`).
- hockinghills-hosting.com uses Squarespace's nameservers and expires Feb 16, 2027.

Before launch, get access to that GoDaddy account or have both domains transferred to Natalie's Hostinger account. The simplest launch-day move is to change each domain's nameservers to Netlify's (Netlify shows them when you add the domain).

## Turning them on at launch (Cole)

The rules only react to the old domains, so they do nothing until those domains point at Netlify.

1. In Netlify, open the site, then **Domain management**.
2. Click **Add a domain** and add `hockinghills-cabinrentals.com`. Add `www.hockinghills-cabinrentals.com` too. Do the same for `hockinghills-hosting.com`, `happyhockingstays.com` and their `www.` versions. Keep `happyhocking.com` as the primary domain.
3. At the registrar for each of those domains, point DNS at Netlify. Netlify shows the exact records on the same screen. For the Wix domain, this is also the step that takes the old site offline, so do it at launch and not before.
4. Wait for Netlify to show a certificate for each domain (usually minutes, sometimes a few hours).
5. Test a few old addresses, for example `hockinghills-cabinrentals.com/cloudsreach`. Each should land on the matching new page.
6. In Google Search Console, open the old site's property and use **Change of address** to point it at happyhocking.com.

Keep the old domains registered and pointed at Netlify for at least a year.
