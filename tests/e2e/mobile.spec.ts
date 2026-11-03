import { expect, test } from "@playwright/test";
import { data } from "./data";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#gists")).toBeAttached();
});

test.describe("phone profiles", () => {
  test.skip(({ isMobile }) => !isMobile, "the iphone-13 and pixel-7 projects carry the phone profiles");

  test("MOB-01 phone profiles: no section causes sideways scroll", async ({ page }) => {
    const width = page.viewportSize()!.width;
    for (const sel of ["header.ds-header", "#suite", "#stack", "#certs", "#projects", "#gists", "footer.pg-end"]) {
      const el = page.locator(sel);
      await el.scrollIntoViewIfNeeded();
      const box = (await el.boundingBox())!;
      expect(box.x + box.width, sel).toBeLessThanOrEqual(width + 0.5);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test("MOB-04 tap acts as click on tab, theme, run again, project and gist", async ({ page, context }) => {
    await context.route(/^https:\/\/(?!127\.0\.0\.1)/, (route) => route.fulfill({ body: "ok" }));
    await page.locator("nav.pg-bar a", { hasText: "Certs" }).tap();
    await expect
      .poll(() => page.locator("#certs").evaluate((e) => Math.round(e.getBoundingClientRect().top)))
      .toBeLessThan(90);

    await page.locator("#theme-void").tap();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "void");

    await expect(page.locator("#suite-run")).toBeEnabled({ timeout: 5000 });
    await page.locator("#suite-run").tap();
    await expect(page.locator("#suite-run")).toBeDisabled();

    const project = page.locator("#projects .pg-entry").first();
    const [p1] = await Promise.all([page.waitForEvent("popup"), project.tap()]);
    await expect.poll(() => p1.url()).toBe(new URL(data.projects[0].url).href);
    await p1.close();

    const gist = page.locator("#gists .pg-gist").first();
    const [p2] = await Promise.all([page.waitForEvent("popup"), gist.tap()]);
    await expect.poll(() => p2.url()).toBe(data.gists[0].url);
  });
});

test("MOB-02 touch targets: listed controls are at least 44px tall", async ({ page }) => {
  const groups = {
    tabs: "nav.pg-bar .pg-tabs a",
    "theme buttons": ".pg-themes button",
    "run again": "#suite-run",
    projects: "#projects .pg-entry",
    gists: "#gists .pg-gist",
  };
  for (const [name, sel] of Object.entries(groups)) {
    const heights = await page.locator(sel).evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    expect(heights.length, name).toBeGreaterThan(0);
    for (const h of heights) expect(h, name).toBeGreaterThanOrEqual(44);
  }
});

test("MOB-05 minimum text size: nothing below 11px", async ({ page }) => {
  const sizes = await page.evaluate(() => {
    const out: [string, number][] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent?.trim() || !n.parentElement) continue;
      out.push([n.textContent.trim().slice(0, 30), parseFloat(getComputedStyle(n.parentElement).fontSize)]);
    }
    return out;
  });
  expect(sizes.length).toBeGreaterThan(50);
  expect(sizes.filter(([, px]) => px < 11)).toEqual([]);
});
