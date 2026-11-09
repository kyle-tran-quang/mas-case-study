// Screenshots every beat anchor (reduced motion = deterministic key poses) into a directory. Usage: node tools/perf/shots.mjs <outDir>
// Run once before and once after a perf change, then `node tools/perf/shots.mjs --diff <dirA> <dirB>` to compare byte-for-byte.
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
if (process.argv[2] === '--diff') {
  const [A, B] = process.argv.slice(3); let bad = 0
  for (const f of fs.readdirSync(A)) { const same = fs.existsSync(path.join(B, f)) && fs.readFileSync(path.join(A, f)).equals(fs.readFileSync(path.join(B, f))); if (!same) { bad++; console.log('DIFF', f) } }
  console.log(bad ? `${bad} frame(s) differ` : 'all frames identical'); process.exit(bad ? 1 : 0)
}
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true })
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage()
await p.goto('http://localhost:4173/work/m-goat', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500)
const anchors = await p.evaluate(() => window.STORY.beats.flatMap(b => (b.texts && b.texts.length ? b.texts.map(t => t.snap) : [b.snap ?? b.range[0]])))
// also a few in-between positions so mid-morph states are covered
const pts = [...anchors, ...[0.12, 0.27, 0.41, 0.55, 0.68, 0.83].map(x => x)]
for (let i = 0; i < pts.length; i++) {
  await p.evaluate(snap => { const l = document.getElementById('layout'); scrollTo({ top: scrollY + l.getBoundingClientRect().top + snap * (l.offsetHeight - innerHeight), behavior: 'instant' }) }, pts[i])
  await p.waitForTimeout(400); await p.screenshot({ path: path.join(out, String(i).padStart(2, '0') + '.png'), animations: 'disabled' })
}
console.log(pts.length, 'frames ->', out); await b.close()
