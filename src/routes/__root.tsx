/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Layout } from '@/components/Layout'
import { NotFound } from '@/components/NotFound'
import appCss from '@/styles.css?url'
import { settings } from '@/lib/content'

// Google Tag Manager snippet, as supplied by GTM. Only added once a container ID is set in Site settings.
const gtmHead = (id: string) => `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`

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
  const gtm = settings.gtmId
  // Mailchimp "connected site" script, as supplied by Mailchimp. Only added once its address is set in Site settings.
  const mcjs = /^https:\/\/chimpstatic\.com\//.test(settings.mailchimpSiteScript) ? settings.mailchimpSiteScript : ''
  return (
    <html lang="en">
      <head>
        {gtm ? <script dangerouslySetInnerHTML={{ __html: gtmHead(gtm) }} /> : null}
        <HeadContent />
        {mcjs ? <script id="mcjs" async src={mcjs} /> : null}
      </head>
      <body>
        {gtm ? (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtm}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
          </noscript>
        ) : null}
        {children}
        <Scripts />
      </body>
    </html>
  )
}
