declare module 'virtual:content' {
  const data: {
    settings: import('./lib/types').Settings
    policies: import('./lib/types').Policies
    pages: import('./lib/types').Pages
    reviews: import('./lib/types').Review[]
    posts: import('./lib/types').PostMeta[]
    cabins: import('./lib/types').CabinSummary[]
    collections: import('./lib/types').Collection[]
    shareImages: string[]
  }
  export default data
}
declare module '*.yml' {
  const cabin: import('./lib/types').Cabin
  export default cabin
}
declare module '*.md' {
  const post: { html: string }
  export default post
}
