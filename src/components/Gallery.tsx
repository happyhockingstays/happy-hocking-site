import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { imgSrcSet, imgUrl } from '@/lib/img'
import type { GalleryGroup } from '@/lib/types'
import { Icon } from './Icon'
import { Photo } from './Photo'

interface Shot {
  image: string
  alt: string
  label?: string
}

interface Props {
  cabin: string
  hero: Shot
  keyShots: Shot[]
  /** Category groups in Natalie's order (Pool, Exterior, Bedrooms...). Photos stay grouped. */
  groups: GalleryGroup[]
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/**
 * Cabin photos: one big hero plus four key shots up top, then "See all photos" opens the
 * full gallery grouped by category, with a caption under every photo ("Bedroom 2 · Queen").
 */
export function Gallery({ cabin, hero, keyShots, groups }: Props) {
  const flat = useMemo(() => groups.flatMap((g) => g.images.map((i) => ({ ...i, group: g.name }))), [groups])
  const [grid, setGrid] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const touchX = useRef<number | null>(null)

  const total = flat.length
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + total) % total)), [total])
  const closeAll = useCallback(() => {
    setOpen(null)
    setGrid(false)
  }, [])

  // Clicking a photo up top opens it full size if it's in the gallery, otherwise the full gallery.
  const openShot = (image: string) => {
    const i = flat.findIndex((f) => f.image === image)
    setGrid(true)
    setOpen(i >= 0 ? i : null)
  }

  useEffect(() => {
    if (!grid) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') (open !== null ? setOpen(null) : closeAll())
      if (open !== null && e.key === 'ArrowRight') step(1)
      if (open !== null && e.key === 'ArrowLeft') step(-1)
    }
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [grid, open, step, closeAll])

  const jump = (name: string) => gridRef.current?.querySelector(`#photos-${slug(name)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const shots = keyShots.slice(0, 4)
  const current = open !== null ? flat[open] : null
  // Where each group starts in the flat list, so a thumbnail knows its place in the viewer.
  const starts = groups.map((_, gi) => groups.slice(0, gi).reduce((sum, g) => sum + g.images.length, 0))

  return (
    <>
      {/* Mosaic: hero plus four key shots. Phones show the hero alone. */}
      <div className="frame relative bg-forest">
        <div className="grid gap-0.5 md:h-[30rem] md:grid-cols-4 md:grid-rows-2 lg:h-[34rem]">
          <button type="button" onClick={() => (hero.image ? openShot(hero.image) : setGrid(true))} className="group block md:col-span-2 md:row-span-2" aria-label={`Open photo: ${hero.alt}`}>
            <Photo src={hero.image} alt={hero.alt} label={hero.alt} priority sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] h-full w-full md:aspect-auto" tint="mustard" />
          </button>
          {shots.map((s, i) => (
            <button key={i} type="button" onClick={() => (s.image ? openShot(s.image) : setGrid(true))} className="hidden md:block" aria-label={`Open photo: ${s.alt || s.label}`}>
              <Photo src={s.image} alt={s.alt} label={s.label || s.alt} sizes="25vw" className="h-full w-full" tint={(['sage', 'terracotta', 'terracotta', 'sage'] as const)[i]} />
            </button>
          ))}
        </div>
        {total > 0 ? (
          <button type="button" onClick={() => setGrid(true)} className="btn btn-light btn-sm absolute bottom-3 right-3 md:bottom-4 md:right-4">
            <Icon name="images" className="h-4 w-4" /> See all {total} photos
          </button>
        ) : null}
      </div>

      {/* Full gallery, grouped by category */}
      {grid ? (
        <div ref={gridRef} className="fixed inset-0 z-[80] overflow-y-auto bg-cream" role="dialog" aria-modal="true" aria-label={`${cabin} photos`}>
          <div className="sticky top-0 z-10 border-b-2 border-forest bg-cream">
            <div className="container-x flex items-center justify-between gap-4 py-3">
              <p className="font-display text-xl leading-tight md:text-2xl">{cabin}</p>
              <button type="button" onClick={closeAll} className="btn btn-forest btn-sm" autoFocus>
                <Icon name="x" className="h-4 w-4" /> Close
              </button>
            </div>
            <div className="container-x no-scrollbar flex gap-2 overflow-x-auto pb-3">
              {groups.map((g) => (
                <button key={g.name} type="button" onClick={() => jump(g.name)} className="chip shrink-0">
                  {g.name} <span className="opacity-60">{g.images.length}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="container-x pb-24 pt-2">
            {groups.map((g, gi) => (
              <section key={g.name} id={`photos-${slug(g.name)}`} className="scroll-mt-32 pt-8">
                <h2 className="h-card">{g.name}</h2>
                <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 lg:grid-cols-4">
                  {g.images.map((p, pi) => {
                    const index = starts[gi] + pi
                    return (
                      <li key={p.image}>
                        <button type="button" onClick={() => setOpen(index)} className="block w-full text-left" aria-label={`Open photo: ${p.alt || p.caption}`}>
                          <div className="overflow-hidden rounded-xl border-2 border-forest bg-sage-tint">
                            <img src={imgUrl(p.image, 640)} srcSet={imgSrcSet(p.image, [320, 480, 640, 960])} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" alt={p.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                          </div>
                          {p.caption ? <span className="meta mt-1.5 block font-bold">{p.caption}</span> : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      ) : null}

      {/* One photo, full size */}
      {current ? (
        <div className="on-forest fixed inset-0 z-[90] flex flex-col bg-forest text-cream" role="dialog" aria-modal="true" aria-label="Photo viewer">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="meta">
              {open! + 1} / {total}
            </span>
            <button type="button" onClick={() => setOpen(null)} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream/10" aria-label="Back to all photos" autoFocus>
              <Icon name="x" className="h-7 w-7" />
            </button>
          </div>
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-3 md:px-20"
            onClick={() => setOpen(null)}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return
              const dx = e.changedTouches[0].clientX - touchX.current
              touchX.current = null
              if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1)
            }}
          >
            <img key={current.image} src={imgUrl(current.image, 1600)} srcSet={imgSrcSet(current.image)} sizes="100vw" alt={current.alt} className="max-h-full max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
            {(['chevron-left', 'chevron-right'] as const).map((icon, i) => (
              <button
                key={icon}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(i ? 1 : -1)
                }}
                className={`absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cream bg-forest/80 hover:bg-forest ${i ? 'right-2 md:right-5' : 'left-2 md:left-5'}`}
                aria-label={i ? 'Next photo' : 'Previous photo'}
              >
                <Icon name={icon} className="h-6 w-6" />
              </button>
            ))}
          </div>
          <p className="px-5 py-4 text-center font-bold">
            {current.caption || current.alt}
            {current.caption && current.caption !== current.group ? <span className="soft font-medium"> · {current.group}</span> : null}
          </p>
        </div>
      ) : null}
    </>
  )
}
