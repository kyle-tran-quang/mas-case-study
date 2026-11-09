import { caseStudies, workHref } from '@/lib/routes'

export default function Home() {
  return (
    <main style={{ font: '18px/1.5 system-ui, sans-serif', maxWidth: 640, margin: '12vh auto', padding: '0 24px' }}>
      <h1 style={{ fontWeight: 500 }}>Case studies</h1>
      <ul>
        {caseStudies.map((study) => (
          <li key={study.slug}>
            <a href={workHref(study.slug)}>{study.name}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}
