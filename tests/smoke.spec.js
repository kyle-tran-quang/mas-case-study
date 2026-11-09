import { test, expect } from "@playwright/test";

test("m-goat route loads without console or page errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", e => {
    console.error("PAGE ERROR STACK:", e.stack || e);
    errors.push(e.message);
  });
  page.on("console", m => {
    if (m.type() === "error") {
      console.error("CONSOLE ERROR:", m.text());
      errors.push(m.text());
    }
  });
  await page.goto("/work/m-goat");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveTitle(/.+/);
  expect(errors).toEqual([]);
});
