import { asset } from './asset'

/**
 * Photos live in /public/images as 2400px JPEGs (uploaded in Pages CMS or added in bulk).
 * On Netlify they are served through the Image CDN, which resizes each one on demand and
 * picks AVIF or WebP for browsers that support it. Anywhere else (local dev, static previews)
 * the original file is used as is.
 */
const CDN = import.meta.env.VITE_IMAGE_CDN === 'netlify'

export const WIDTHS = [480, 800, 1200, 1600, 2400]

export function imgUrl(src: string, width: number, quality = 72) {
  if (!src) return ''
  if (!CDN || /^https?:/.test(src) || src.endsWith('.svg')) return asset(src)
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}

export function imgSrcSet(src: string, widths = WIDTHS) {
  if (!CDN || !src || /^https?:/.test(src) || src.endsWith('.svg')) return undefined
  return widths.map((w) => `${imgUrl(src, w)} ${w}w`).join(', ')
}
