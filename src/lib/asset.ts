// Prefix public-folder paths with Vite's base so the same code works on Netlify ("/")
// and in a relative-path preview build ("./").
export const asset = (path: string) => {
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
}
