import { Suspense } from 'react'
import Home from './pages/Home'
import { currentRoute } from './lib/routes'
import { workPage } from './lib/pages'

export default function App() {
  const route = currentRoute()
  const Page = (route === '/' ? undefined : workPage(route)) ?? Home

  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  )
}
