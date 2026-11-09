import { test, expect } from "@playwright/test";

// Visual parity for the M-GOAT case study. Reduced motion makes the scene jump to each beat's key pose, so the frames are
// deterministic (no smoothing, no hand-card clock). MG_URL points the same spec at the page under test.
//   baseline: MG_URL=/m-goat/ npx playwright test parity --update-snapshots
//   check:    npx playwright test parity            (defaults to the React route)
const URL = process.env.MG_URL || "/work/m-goat";

test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

test("m-goat key poses match the reference frames", async ({ page }) => {
  const errors = [];
  page.on("pageerror", e => errors.push(String(e)));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  const failed = [];
  page.on("requestfailed", r => failed.push(r.url()));
  page.on("response", r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

  await page.goto(URL);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);

  await page.waitForTimeout(400);
  await expect(page).toHaveScreenshot("00-hero.png", { maxDiffPixelRatio: 0.002 });

  const anchors = await page.evaluate(() =>
    window.STORY.beats.flatMap(b => (b.texts && b.texts.length ? b.texts.map(t => t.snap) : [b.snap ?? b.range[0]])));
  expect(anchors.length).toBeGreaterThan(10);

  for (let i = 0; i < anchors.length; i++) {
    await page.evaluate(snap => {
      const l = document.getElementById("layout");
      const top = window.scrollY + l.getBoundingClientRect().top;
      window.scrollTo({ top: top + snap * (l.offsetHeight - window.innerHeight), behavior: "instant" });
    }, anchors[i]);
    await page.waitForTimeout(350);
    await expect(page).toHaveScreenshot(`${String(i + 1).padStart(2, "0")}-beat.png`, { maxDiffPixelRatio: 0.002 });
  }

  expect(errors, "console / page errors").toEqual([]);
  // Assets already missing in the old page (simulator.mp4 etc.) are tolerated only if they are not new 404s.
  expect(failed.filter(u => !/simulator\.mp4|handcard-right|tile-\d/.test(u)), "failed requests").toEqual([]);
});
