// Self-time hot spots from a V8 CPU profile over a scroll range. Usage: node tools/perf/cpuprofile.mjs --from=0.45 --to=0.52 [--rate=6]
import { chromium } from '@playwright/test'
const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) ?? `--${k}=${d}`).split('=')[1]
const RATE = +arg('rate', 6), FROM = +arg('from', 0), TO = +arg('to', 1), URL = arg('url', 'http://localhost:4173/work/m-goat')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const cdp = await page.context().newCDPSession(page)
await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(1000)
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
await page.evaluate(y => scrollTo(0, y), FROM * total); await page.waitForTimeout(800)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE })
await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 }); await cdp.send('Profiler.start')
for (let i = 0; i <= 80; i++) { await page.evaluate(y => scrollTo(0, y), (FROM + (TO - FROM) * i / 80) * total); await page.waitForTimeout(40) }
const { profile } = await cdp.send('Profiler.stop')
const self = new Map(), byId = new Map(profile.nodes.map(n => [n.id, n]))
profile.samples.forEach((id, i) => { const n = byId.get(id), cf = n.callFrame, k = `${cf.functionName || '(anon)'} ${cf.url.split('/').pop()}:${cf.lineNumber + 1}`; self.set(k, (self.get(k) || 0) + (profile.timeDeltas[i] || 0)) })
const sum = [...self.values()].reduce((a, b) => a + b, 0)
;[...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18).forEach(([k, v]) => console.log((v / 1000).toFixed(0).padStart(7) + 'ms ' + (100 * v / sum).toFixed(1).padStart(5) + '%  ' + k))
await browser.close()
