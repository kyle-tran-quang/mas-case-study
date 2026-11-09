import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

/** Client-side routes rendered by src/App.tsx (keep in sync with `loaders` in src/lib/pages.ts). */
const reactRoutes = ['/work/m-goat']

const routeForPath = (pathname: string) => pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/'

/**
 * Gives every client-side route its own HTML entry, as in the design project: the dev server answers deep links such as
 * /work/m-goat with the app shell, and the build writes `<route>.html` and `<route>/index.html` copies of index.html.
 */
function reactRouteHtml(): Plugin {
  return {
    name: 'react-route-html',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        try {
          const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
          if (reactRoutes.includes(routeForPath(pathname))) req.url = '/'
        } catch {
          /* malformed URL: let Vite answer */
        }
        next()
      })
    },
    writeBundle(options) {
      const outDir = options.dir ?? path.resolve(import.meta.dirname, 'dist')
      const appHtml = fs.readFileSync(path.join(outDir, 'index.html'))
      for (const route of reactRoutes) {
        for (const target of [`${route.slice(1)}.html`, `${route.slice(1)}/index.html`]) {
          const file = path.join(outDir, target)
          fs.mkdirSync(path.dirname(file), { recursive: true })
          fs.writeFileSync(file, appHtml)
        }
      }
    },
  }
}

export default defineConfig({
  base: process.env.PUBLIC_BASE ? `${process.env.PUBLIC_BASE}/` : '/',
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  server: {
    port: 5173,
    open: '/work/m-goat',
    // Raw Figma exports and tooling: no reload when they change.
    watch: { ignored: ['**/.claude/**', '**/graphify-out/**', '**/test-results/**'] },
  },
  plugins: [react(), reactRouteHtml()],
})
