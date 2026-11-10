import { useEffect, useRef, useState } from 'react'
import { asset } from '@/lib/asset'
import { Icon } from './Icon'

/**
 * Looping background video for the homepage hero. It sits on top of the hero photo and
 * fades in once it's playing, so the photo paints first and nothing flashes.
 * Phones get the tall cut. Visitors with reduced motion or data saver turned on keep the photo.
 * The pause button is there for anyone who finds the movement distracting.
 *
 * The clip is made from the cabins' own photos (scripts/make-hero-video.py). A real video
 * from the clients can replace it: same file names, or new paths in Pages CMS.
 */
export function HeroVideo({ wide, tall }: { wide: string; tall: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(true)
  const pick = () => asset(tall && window.matchMedia('(max-width: 767px)').matches ? tall : wide)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (reduce || saveData) return
    v.src = pick()
    v.play().catch(() => setPaused(true))
  }, [wide, tall])

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      if (!v.getAttribute('src')) v.src = pick()
      v.play().catch(() => {})
    } else v.pause()
  }

  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          setPlaying(true)
          setPaused(false)
        }}
        onPause={() => setPaused(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${playing ? 'opacity-100' : 'opacity-0'}`}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-[calc(var(--header-h)+0.5rem)] z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream/70 bg-forest/50 text-cream backdrop-blur-sm transition-colors hover:bg-forest/80 lg:bottom-6 lg:right-7 lg:top-auto"
        aria-label={paused ? 'Play the background video' : 'Pause the background video'}
      >
        <Icon name={paused ? 'play' : 'pause'} className="h-4 w-4" />
      </button>
    </>
  )
}
