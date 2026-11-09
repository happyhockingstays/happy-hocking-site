import type { Cabin, CabinSummary } from '../src/lib/types'

export const ROOT: string
export const SITE_URL: string
export function loadCabins(): Cabin[]
export function cabinSummary(c: Cabin): CabinSummary
