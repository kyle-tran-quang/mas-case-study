import { useEffect } from 'react'
import MGoatHero from '@/components/case-study/mgoat/MGoatHero'
import SectionNav from '@/components/case-study/mgoat/SectionNav'
import '@/components/case-study/mgoat/styles'

/** One label per rail chapter, in order. Keep in step with `STORY.chapters` and each beat's `chapter` in engine/story.js. */
const CHAPTERS = [
  'Maximo',
  'The learning curve',
  'The opportunity',
  'The goal',
  'Capabilities',
  'Milestones and simulator',
  'The first iteration',
  'The second iteration',
  'Fewer questions',
  'The report',
  'Value of expansion',
  'Maturity maps',
]

/**
 * M-GOAT case study: a scroll-driven scene. The hero pins and morphs into a split layout (stage on the left, story on
 * the right); the engine in components/case-study/mgoat/engine owns everything inside #scene and #text.
 *
 * The engine attaches window listeners it never removes, so the page is meant to be loaded, not remounted: navigate to
 * it with a normal link, not a client-side transition.
 */
export default function MGoat() {
  useEffect(() => {
    let cancelled = false
    // Loaded here, not at the top, so the ~400KB engine is only fetched for this route and runs once the markup exists.
    import('@/components/case-study/mgoat/engine').then(({ startMGoat }) => {
      if (!cancelled) startMGoat()
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <MGoatHero />
      <div className="intro-under" id="introUnder" aria-hidden="true">
        <div className="u-stage">
          <div id="underScene" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="u-col text-col" id="underCol" />
      </div>
      <div className="layout pre-intro" id="layout" data-theme="light">
        <div className="stage-col">
          <div id="scene" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="text-col" id="text" />
      </div>
      <SectionNav chapters={CHAPTERS} />
    </>
  )
}
