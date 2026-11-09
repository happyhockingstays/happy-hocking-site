import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'

/**
 * Internal link. On the real site this is a TanStack Router <Link> (prefetches on hover).
 * VITE_HASH_ROUTING is only set for the static claude.ai preview build, which can't use real paths.
 */
const HASH = import.meta.env.VITE_HASH_ROUTING === 'true'

interface Props {
  to: string
  hash?: string
  className?: string
  children: ReactNode
  onClick?: () => void
  'aria-label'?: string
  'data-reveal'?: boolean
}

export function SiteLink({ to, hash, className, children, onClick, ...rest }: Props) {
  if (HASH) {
    const href = `#${to}${hash ? `--${hash}` : ''}`
    return (
      <a href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} hash={hash} className={className} onClick={onClick} preload="intent" {...rest}>
      {children}
    </Link>
  )
}

/** Current pathname, for active nav states. */
export function useCurrentPath(): string {
  if (HASH) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [p, setP] = useState(() => (typeof window === 'undefined' ? '/' : readHash()))
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const on = () => setP(readHash())
      window.addEventListener('hashchange', on)
      return () => window.removeEventListener('hashchange', on)
    }, [])
    return p
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRouterState({ select: (s) => s.location.pathname })
}

let lastPath = '/'
function readHash() {
  const h = window.location.hash.replace(/^#/, '')
  // In-page anchors (e.g. #dogs on the FAQ) keep the current page
  if (h === '' || h.startsWith('/')) lastPath = h.split('--')[0] || '/'
  return lastPath
}
