import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import netlify from '@netlify/vite-plugin-tanstack-start'
import content from './content/vite-plugin.mjs'
import { loadCabins } from './content/lib.mjs'

// One page per visible cabin. Listed here so each is prerendered even if nothing links to it yet.
const cabins = loadCabins()

// Search engines stay out until the site is on its real domain. Netlify sets URL to the site's
// primary address, so this turns itself off the day happyhocking.com becomes the primary domain.
const live = (process.env.URL || '').includes('happyhocking.com')

export default defineConfig({
  server: { port: 3000 },
  define: { 'import.meta.env.VITE_NOINDEX': JSON.stringify(live ? '' : 'true') },
  plugins: [
    content(),
    tsConfigPaths(),
    tanstackStart({
      // Every page is static content, so prerender all of them to plain HTML.
      // Good for SEO, fast on Netlify's CDN, and Netlify Forms can detect the forms.
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
        // Write /cabins/pickle-hill.html, not /cabins/pickle-hill/index.html, so the canonical
        // URLs have no trailing slash and Netlify serves them without a redirect.
        autoSubfolderIndex: false,
        // Index routes are registered with a trailing slash but linked and canonical without one.
        filter: (page) => page.path === '/' || !page.path.endsWith('/'),
      },
      pages: cabins.map((c) => ({ path: `/cabins/${c.slug}` })),
      sitemap: {
        enabled: true,
        host: 'https://happyhocking.com',
      },
    }),
    viteReact(),
    tailwindcss(),
    netlify(),
  ],
})
