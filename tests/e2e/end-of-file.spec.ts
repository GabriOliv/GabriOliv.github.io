import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("PAGE-09 footer: no footnotes, no site links, end of file", async ({ page }) => {
  await expect(page.locator(".ds-notes")).toHaveCount(0);
  await expect(page.locator("footer.pg-end a")).toHaveCount(0);
  expect(await page.locator("footer.pg-end .pg-eof").innerText()).toBe("END OF FILE");
  await expect(page.locator("main > footer.pg-end")).toBeAttached();
  expect(
    await page
      .locator("main > *")
      .last()
      .evaluate((e) => e.tagName),
  ).toBe("FOOTER");
});
