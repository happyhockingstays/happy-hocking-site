import { BookLink } from './Header'
import { Sparkle } from './Icon'

/** The Mustard booking band that closes a page: big and bold, with one button. */
export function ClosingBand({ heading = 'Find your happy place', text, button = 'Check availability' }: { heading?: string; text?: string; button?: string }) {
  return (
    <section className="sec-mustard sec-line py-14 md:py-20">
      <div className="container-x flex flex-col items-center text-center" data-reveal>
        <Sparkle className="h-8 w-8 text-forest" />
        <h2 className="h-display mt-4 max-w-3xl">{heading}</h2>
        {text ? <p className="lead mt-4 max-w-xl">{text}</p> : null}
        <BookLink className="btn btn-book btn-lg mt-8">{button}</BookLink>
      </div>
    </section>
  )
}
