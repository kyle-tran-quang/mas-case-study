// Scroll-through profiler with CPU throttling.  Usage: node tools/perf/profile.mjs [--rate=6] [--url=http://localhost:4173/work/m-goat] [--steps=240]
import { chromium } from '@playwright/test'

const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) ?? `--${k}=${d}`).split('=')[1]
const RATE = +arg('rate', 6), URL = arg('url', 'http://localhost:4173/work/m-goat'), STEPS = +arg('steps', 240)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const cdp = await page.context().newCDPSession(page)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE })
await cdp.send('Performance.enable')
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

await page.evaluate(() => {
  window.__frames = []; window.__long = []
  let prev = performance.now()
  const loop = t => { window.__frames.push(t - prev); prev = t; requestAnimationFrame(loop) }
  requestAnimationFrame(loop)
  new PerformanceObserver(l => l.getEntries().forEach(e => window.__long.push(e.duration))).observe({ entryTypes: ['longtask'] })
})
const m0 = await cdp.send('Performance.getMetrics')
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
const perSection = []
for (let i = 0; i <= STEPS; i++) {
  await page.evaluate(y => { window.__frames.length = 0; scrollTo(0, y) }, Math.round((i / STEPS) * total))
  await page.waitForTimeout(90)   // let the engine's rAF ease settle a few frames
  perSection.push(await page.evaluate(() => window.__frames.slice()))
}
const m1 = await cdp.send('Performance.getMetrics')
const g = (m, n) => m.metrics.find(x => x.name === n).value
const frames = perSection.flat()
const pct = (a, p) => [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * p))]
const long = await page.evaluate(() => window.__long)
const worst = perSection.map((f, i) => ({ i, pos: +(i / STEPS).toFixed(3), max: Math.max(0, ...f), avg: f.reduce((a, b) => a + b, 0) / (f.length || 1) })).sort((a, b) => b.avg - a.avg).slice(0, 8)
const r = x => Math.round(x * 10) / 10
console.log(JSON.stringify({
  rate: RATE, frames: frames.length,
  frameMs: { p50: r(pct(frames, .5)), p95: r(pct(frames, .95)), p99: r(pct(frames, .99)), max: r(Math.max(...frames)) },
  over50ms: frames.filter(f => f > 50).length,
  longTasks: { count: long.length, totalMs: Math.round(long.reduce((a, b) => a + b, 0)) },
  cpuSec: { script: r(g(m1, 'ScriptDuration') - g(m0, 'ScriptDuration')), layout: r(g(m1, 'LayoutDuration') - g(m0, 'LayoutDuration')), style: r(g(m1, 'RecalcStyleDuration') - g(m0, 'RecalcStyleDuration')), task: r(g(m1, 'TaskDuration') - g(m0, 'TaskDuration')) },
  layoutCount: g(m1, 'LayoutCount') - g(m0, 'LayoutCount'), styleRecalcs: g(m1, 'RecalcStyleCount') - g(m0, 'RecalcStyleCount'),
  domNodes: g(m1, 'Nodes'), heapMB: r(g(m1, 'JSHeapUsedSize') / 1e6),
  worstSections: worst.map(w => ({ ...w, max: r(w.max), avg: r(w.avg) })),
}, null, 1))
await browser.close()
