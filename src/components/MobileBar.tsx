import { BookLink } from './Header'
import { Icon } from './Icon'
import { SiteLink, useCurrentPath } from './SiteLink'

/**
 * Pinned to the bottom of the screen on phones: Book now and a contact button, always in reach.
 * Book now jumps to the booking widget on a cabin page, and to the cabin search everywhere else.
 */
export function MobileBar() {
  const path = useCurrentPath()
  const owner = path === '/co-hosting'
  // The review form is a single-purpose page: nothing should sit on top of it.
  if (path === '/review') return null
  return (
    <div className="on-forest fixed inset-x-0 bottom-0 z-40 border-t-2 border-mustard bg-forest px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
      <div className="flex items-center gap-3">
        <SiteLink to="/contact" className="btn btn-light !px-4" aria-label="Contact us">
          <Icon name="mail" className="h-5 w-5" />
          <span>Contact</span>
        </SiteLink>
        {owner ? (
          <a href="#get-in-touch" className="btn btn-mustard flex-1">
            Get in touch
          </a>
        ) : (
          <BookLink className="btn btn-book flex-1">Book now</BookLink>
        )}
      </div>
    </div>
  )
}
