import { imgSrcSet, imgUrl } from '@/lib/img'

interface PhotoProps {
  /** Site path, e.g. /images/cabins/pickle-hill/pool/pickle-hill-pool-001.jpg. Empty shows a labeled placeholder. */
  src: string
  alt: string
  /** CSS aspect ratio for the box, e.g. "4 / 3". Leave out when the parent sets the height. */
  ratio?: string
  /** How wide the photo shows, for the browser to pick the right size. */
  sizes?: string
  className?: string
  /** Load right away (the first photo on a page). Everything else loads as it scrolls into view. */
  priority?: boolean
  /** Placeholder label when no image is set yet. */
  label?: string
  /** Full placeholder text, when "Photo: label" doesn't fit (a map, a video). */
  emptyText?: string
  tint?: 'mustard' | 'sage' | 'terracotta'
  position?: string
}

const tints = { mustard: 'bg-mustard-tint', sage: 'bg-sage-tint', terracotta: 'bg-terracotta-tint' }

/** A photo that fills its box. Resized by Netlify's Image CDN on the live site. */
export function Photo({ src, alt, ratio, sizes = '100vw', className = '', priority, label, emptyText, tint = 'sage', position }: PhotoProps) {
  const style = ratio ? { aspectRatio: ratio } : undefined
  if (!src) {
    return (
      <div className={`photo-empty ${tints[tint]} ${className}`} style={style} role="img" aria-label={alt || label || 'Photo coming soon'}>
        <span className="chip">{emptyText || `Photo: ${label || alt || 'coming soon'}`}</span>
      </div>
    )
  }
  return (
    <div className={`overflow-hidden ${tints[tint]} ${className}`} style={style}>
      <img
        src={imgUrl(src, 1200)}
        srcSet={imgSrcSet(src)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className="h-full w-full object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  )
}
