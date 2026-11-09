import { asset } from './asset'

/** Case studies in menu order. Add new ones here, in pages.ts, and in vite.config.ts `reactRoutes`. */
export const caseStudies = [{ name: 'Maximo Growth Assessment Tool (M-GOAT)', slug: 'm-goat' }] as const

export const homeHref = asset('')
export const workHref = (slug: string) => asset(`work/${slug}`)

/** Current path relative to the deploy base, without `.html`, `/index.html` or a trailing slash. */
export function currentRoute() {
  const base = import.meta.env.BASE_URL
  let path = window.location.pathname
  if (path.startsWith(base)) path = `/${path.slice(base.length)}`
  return path.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/+$/, '') || '/'
}
