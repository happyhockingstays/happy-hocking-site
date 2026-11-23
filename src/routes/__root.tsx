/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Layout } from '@/components/Layout'
import { NotFound } from '@/components/NotFound'
import appCss from '@/styles.css?url'
import { settings } from '@/lib/content'

// Google Tag Manager. Loads only on the real site (VITE_TRACKING, set in vite.config.ts) and only once a
// container ID is set in Site settings. GA4 loads inside GTM: never add gtag.js here as well, or visits
// count twice. The full setup is in docs/tracking/README.md.
const tracking = import.meta.env.VITE_TRACKING === 'true'

// Consent defaults run before GTM. Advertising cookies are off when the browser sends Global Privacy Control
// or the visitor turned them off on /privacy#choices (cookie hh_ads_optout=1). Visit statistics stay on.
const consentDefaults = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
(function(){var off=navigator.globalPrivacyControl===true||/(?:^|;\\s*)hh_ads_optout=1/.test(document.cookie);
var ads=off?'denied':'granted';
gtag('consent','default',{ad_storage:ads,ad_user_data:ads,ad_personalization:ads,analytics_storage:'granted'});
if(off)gtag('set','ads_data_redaction',true);})();
gtag('js',new Date());`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'theme-color', content: '#1f3d2e' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', type: 'image/png', href: '/favicon-32.png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  shellComponent: RootDocument,
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  notFoundComponent: () => (
    <Layout>
      <NotFound />
    </Layout>
  ),
})

function RootDocument({ children }: { children: ReactNode }) {
  const gtm = tracking && /^GTM-[A-Z0-9]+$/.test(settings.gtmId.trim()) ? settings.gtmId.trim() : ''
  // Mailchimp "connected site" script, as supplied by Mailchimp. Only added once its address is set in Site settings.
  const mcjs = /^https:\/\/chimpstatic\.com\//.test(settings.mailchimpSiteScript) ? settings.mailchimpSiteScript : ''
  return (
    <html lang="en">
      <head>
        {gtm ? (
          <>
            <script dangerouslySetInnerHTML={{ __html: consentDefaults }} />
            <script async src={`https://www.googletagmanager.com/gtm.js?id=${gtm}`} />
          </>
        ) : null}
        <HeadContent />
        {mcjs ? <script id="mcjs" async src={mcjs} /> : null}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
