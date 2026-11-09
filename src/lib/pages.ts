import { lazy, type ComponentType } from 'react'

type PageModule = { default: ComponentType }

// Case studies, loaded on demand. Routes not listed here fall back to the homepage. The `react-route-html` Vite plugin
// gives each route its own HTML entry (keep its `reactRoutes` list in sync).
const loaders: Record<string, () => Promise<PageModule>> = {
  '/work/m-goat': () => import('@/pages/work/MGoat'),
}

const lazyPages = Object.fromEntries(Object.entries(loaders).map(([route, load]) => [route, lazy(load)]))

export function workPage(route: string): ComponentType | undefined {
  return lazyPages[route]
}
