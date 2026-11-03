import { expect, test } from "@playwright/test";
import { buildWith, dataFixture, previewOn } from "./helpers";

/** An unbroken ~200-character URL, longer than the 288px column at 320. */
const LONG_URL = "https://gabrioliv.github.io/" + "long_path_without_breaks_".repeat(7);

test("PAGE-12 long URLs in descriptions wrap at 320", async ({ page }) => {
  const build = buildWith(
    dataFixture((data) => {
      data.projects[0].description = `Live at ${LONG_URL} now.`;
      data.gists[0].description = `Notes at ${LONG_URL} now.`;
    }),
  );
  expect(build.status, build.output).toBe(0);
  const server = await previewOn(build.outDir, 4176);
  try {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(server.url);
      await expect(page.locator("#projects .pg-entry-desc").first()).toContainText(LONG_URL);
      await expect(page.locator("#gists .pg-gist-desc").first()).toContainText(LONG_URL);
      const sideways = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(sideways, `width ${width}`).toBeLessThanOrEqual(0);
    }
  } finally {
    server.stop();
  }
});
