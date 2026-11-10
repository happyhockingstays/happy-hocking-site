# Happy Hocking Stays website

Direct-booking and co-hosting site for Happy Hocking Stays, private cabins in the Hocking Hills of Ohio.
Live domain: **happyhocking.com** (happyhockingstays.com forwards to it).

**Stack:** TanStack Start, React 19, Tailwind CSS v4 and self-hosted fonts. Every page is prerendered to static HTML at build time. Hosting is Netlify, bookings run on Hospitable widgets, and the clients edit content in Pages CMS.

**Picking this up in a new chat?** Start with `HANDOFF.md`. Project rules for Claude and Cursor are in `AGENTS.md`.

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
| Photo notes and the resend list | `docs/photos.md`, `docs/photos-to-resend.csv` |
| Reviews: how they work, the Hospitable message, Netlify emails | `docs/reviews.md` |
| Redirects from the old Wix site | `docs/redirects.md`, `docs/redirects.csv` |

## Deploy to Netlify

1. In Netlify: **Add new site > Import an existing project > GitHub** and pick this repo. Build settings come from `netlify.toml`.
2. **Forms:** enable form detection, then add the hosts' email under Forms > Submission notifications. Steps are in `docs/reviews.md`.
3. **Domain:** add happyhocking.com as the primary domain and point DNS at Netlify. The site tells search engines to stay away until this is done, then opens up by itself.
4. **Old domains:** add hockinghills-cabinrentals.com and happyhockingstays.com to the same Netlify site so the redirects work. Steps are in `docs/redirects.md`.
5. Submit `https://happyhocking.com/sitemap.xml` in Google Search Console.
