import { test, expect } from "@playwright/test";

// The Stage C intro only plays when scroll crosses TIMING.C.intro.trigger moving forward in small steps, so scroll like a
// reader. Covers the run-time loading of the generation runtime (vendor files under /assets/mgoat) and the intro layer.
test.use({ viewport: { width: 1440, height: 900 } });

test("stage C intro plays, loads its runtime and clears", async ({ page }) => {
  test.setTimeout(90000);
  const problems = [], runtime = [];
  page.on("pageerror", e => problems.push(String(e)));
  page.on("console", m => { if (m.type() === "warning" && /StageCIntro/.test(m.text())) problems.push(m.text().slice(0, 120)); });
  page.on("response", r => {
    if (r.status() >= 400 && !/simulator\.mp4/.test(r.url())) problems.push(`${r.status()} ${r.url()}`);
    if (/vendor\/transitions/.test(r.url())) runtime.push(r.url().split("/").pop());
  });
  await page.addInitScript(() => {
    window.__sci = { layer: false, on: false };
    new MutationObserver(() => {
      if (document.querySelector(".sci-layer")) window.__sci.layer = true;
      if (document.body && document.body.classList.contains("sci-on")) window.__sci.on = true;
    }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  });
  await page.goto("/work/m-goat");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);

  await page.evaluate(async () => {
    const l = document.getElementById("layout"), v = () => (-l.getBoundingClientRect().top / innerHeight) * 100;
    const stop = window.TIMING.C.intro.trigger + 15;
    for (let i = 0; i < 6000 && v() < stop; i++) { scrollBy(0, 20); await new Promise(r => setTimeout(r, 4)); }
  });
  await page.waitForFunction(() => window.StageCIntro.state === "done", null, { timeout: 15000 });

  const sci = await page.evaluate(() => window.__sci);
  expect(sci).toEqual({ layer: true, on: true });
  expect(await page.evaluate(() => document.body.classList.contains("sci-on"))).toBe(false);
  expect(runtime).toContain("ui-generation.js");
  expect(problems).toEqual([]);
});
