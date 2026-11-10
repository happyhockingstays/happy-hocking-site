# Redirects from the old Wix site

Every page on hockinghills-cabinrentals.com has a new home on happyhocking.com, so Google rankings and old links carry over. The map is `docs/redirects.csv`. The build turns it into the redirect rules Netlify uses (`scripts/postbuild.mjs` writes `_redirects`), so edit the CSV, never the rules.

The old URLs came from the live Wix sitemap on Nov 9, 2026: 16 pages, 13 blog posts and 5 blog categories.

## What goes where

- The 8 old cabin pages go to their new cabin pages. `/cloudsreach` and `/new-dunkle-creek` change names.
- `/properties` and its leftover copy go to `/cabins`. `/contact-us` goes to `/contact`. `/faqs` stays `/faqs`.
- `/sign-up-insider-list` goes to the signup in the footer.
- Each blog post goes from `/post/its-name` to `/blog/its-name`. The names stay the same.
- Blog category pages go to `/blog`.
- Anything not on the list goes to the homepage.
- happyhockingstays.com forwards to happyhocking.com, page for page.

## Open questions

1. **Phoenix Landing** has a page on the old site and isn't on the new one. It points to `/cabins`. Cole OK'd this on Nov 9.
2. **The 13 blog posts haven't been moved over yet.** Until a post exists on the new site, its old address goes to the blog page as a temporary redirect. The day the post is added with the same name, the build switches it to a permanent one. Move the posts before launch.
3. **2 winter guides overlap** (both "2026" guides). Consider merging them in the SEO pass and pointing both old addresses at the one that stays.
4. **hockinghills-hosting.com**, the old co-hosting site, isn't in the map. If it's being retired too, point it at `/co-hosting` the same way.

## Turning them on at launch (Cole)

The rules only react to the old domains, so they do nothing until those domains point at Netlify.

1. In Netlify, open the site, then **Domain management**.
2. Click **Add a domain** and add `hockinghills-cabinrentals.com`. Add `www.hockinghills-cabinrentals.com` too. Do the same for `happyhockingstays.com` and `www.happyhockingstays.com`. Keep `happyhocking.com` as the primary domain.
3. At the registrar for each of those domains, point DNS at Netlify. Netlify shows the exact records on the same screen. For the Wix domain, this is also the step that takes the old site offline, so do it at launch and not before.
4. Wait for Netlify to show a certificate for each domain (usually minutes, sometimes a few hours).
5. Test a few old addresses, for example `hockinghills-cabinrentals.com/cloudsreach`. Each should land on the matching new page.
6. In Google Search Console, open the old site's property and use **Change of address** to point it at happyhocking.com.

Keep the old domains registered and pointed at Netlify for at least a year.
