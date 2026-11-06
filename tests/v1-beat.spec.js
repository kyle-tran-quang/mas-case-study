import { test, expect } from "@playwright/test";

// Scroll positions are in vh of the 750vh layout; introVh (120) precedes it. y(vh) = (100 + 120 - 100)... computed in-page from the layout instead of hard-coding.
const goto = async (page, vh) => page.evaluate(v => {
  const l = document.getElementById("layout"), top = scrollY + l.getBoundingClientRect().top;
  scrollTo({ top: top + (v / 100) * innerHeight, behavior: "instant" });
}, vh);
const auto = page => page.evaluate(() => window.__mgoat.auto());

test.use({ viewport: { width: 1440, height: 900 } });

test("v1 beat: live UI, auto-scroll, skip, no errors", async ({ page }) => {
  const errors = [];
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", e => errors.push(String(e)));
  await page.goto("/m-goat/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  await goto(page, 400); await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/mg-shots/1-diagram.png" });
  await goto(page, 462); await page.waitForTimeout(900);
  await page.screenshot({ path: "/tmp/mg-shots/2-v1-landed.png" });

  await goto(page, 491); await page.waitForTimeout(500);
  expect((await auto(page)).state).toBe("playing");
  await page.waitForTimeout(3500);
  await page.screenshot({ path: "/tmp/mg-shots/3-v1-mid.png" });
  const mid = await auto(page);
  expect(mid.p).toBeGreaterThan(0.2); expect(mid.p).toBeLessThan(0.9);

  // a wheel during playback (after the grace period) skips to the end and hands the scroll back
  await page.mouse.wheel(0, 200); await page.waitForTimeout(700);
  expect((await auto(page)).state).toBe("done");
  expect((await auto(page)).p).toBe(1);
  await page.screenshot({ path: "/tmp/mg-shots/4-v1-end.png" });

  await goto(page, 540); await page.waitForTimeout(900);
  await page.screenshot({ path: "/tmp/mg-shots/5-v2-rest.png" });
  expect((await auto(page)).state).toBe("done");          // scrolling forward does not replay

  await goto(page, 440); await page.waitForTimeout(500);   // back above `at` re-arms it
  expect((await auto(page)).state).toBe("idle");
  expect(errors).toEqual([]);
});
