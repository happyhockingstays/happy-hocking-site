declare module 'virtual:content' {
  const data: {
    settings: import('./lib/types').Settings
    policies: import('./lib/types').Policies
    cabins: import('./lib/types').CabinSummary[]
  }
  export default data
}
declare module '*.yml' {
  const cabin: import('./lib/types').Cabin
  export default cabin
}
