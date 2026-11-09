import { settings, telHref } from '@/lib/content'
import { asset } from '@/lib/asset'
import { InsiderSignup } from './Forms'
import { navLeft, navRight } from './Header'
import { Icon } from './Icon'
import { SiteLink } from './SiteLink'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="on-forest sec-forest pb-24 lg:pb-0">
      {/* Insider list */}
      <div className="border-b-2 border-cream/15">
        <div className="container-x grid items-center gap-8 py-12 md:py-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow">The insider list</p>
            <h2 className="h-section mt-2">
              Open weekends and deals, <span className="accent">straight to your inbox</span>
            </h2>
          </div>
          <div>
            <InsiderSignup id="footer-insider" />
            <p className="meta soft mt-3">No spam. Unsubscribe any time.</p>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-10 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-4">
          <img src={asset('/images/brand/wordmark-reversed.svg')} alt="Happy Hocking Stays" width={468} height={246} className="h-24 w-auto" loading="lazy" />
          <p className="soft mt-5 max-w-sm">
            Private Hocking Hills cabins with pools and hot tubs, and co-hosting for local vacation homeowners.
          </p>
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow mb-4">Explore</h2>
          <ul className="grid gap-2 font-bold">
            {[...navLeft, ...navRight].map((n) => (
              <li key={n.to}>
                <SiteLink to={n.to} className="hover:text-mustard">
                  {n.label}
                </SiteLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow mb-4">For owners</h2>
          <ul className="grid gap-2 font-bold">
            <li>
              <SiteLink to="/co-hosting" className="hover:text-mustard">
                Co-host with us
              </SiteLink>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h2 className="eyebrow mb-4">Happy to help</h2>
          <ul className="grid gap-3 font-bold">
            {settings.phone ? (
              <li>
                <a href={telHref(settings.phone)} className="flex items-center gap-2.5 hover:text-mustard">
                  <Icon name="phone" className="h-5 w-5" /> {settings.phone}
                </a>
              </li>
            ) : null}
            {settings.email ? (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 [overflow-wrap:anywhere] hover:text-mustard">
                  <Icon name="mail" className="h-5 w-5 shrink-0" /> {settings.email}
                </a>
              </li>
            ) : null}
            {settings.instagram ? (
              <li>
                <a href={`https://www.instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-mustard">
                  <Icon name="instagram" className="h-5 w-5" /> @{settings.instagram}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-cream/15">
        <div className="container-x flex flex-col items-center gap-4 py-6 text-sm md:flex-row md:justify-between">
          <p className="soft flex items-center gap-2">
            <Icon name="pin" className="h-4 w-4" /> Hocking Hills, Ohio
          </p>
          <img src={asset('/images/brand/monogram-reversed.svg')} alt="" width={118} height={116} className="h-10 w-auto" loading="lazy" />
          <p className="soft">
            © {year} {settings.legalName}
          </p>
        </div>
      </div>
    </footer>
  )
}
