import { expect, test } from "@playwright/test";
import { data } from "./data";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("GIST-01 gist entries: data order, name, language tag, verbatim description", async ({ page }) => {
  const entries = page.locator("#gists .pg-gist");
  await expect(entries.locator(".pg-gist-name")).toHaveText(data.gists.map((g) => g.name));
  await expect(entries.locator(".ds-tag")).toHaveText(data.gists.map((g) => g.language.toUpperCase()));
  await expect(entries.locator(".pg-gist-desc")).toHaveText(data.gists.map((g) => g.description));
});

test("GIST-02 gist opens its URL in a new tab", async ({ page, context }) => {
  await context.route(/^https:\/\/(?!127\.0\.0\.1)/, (route) => route.fulfill({ body: "ok" }));
  const entry = page.locator("#gists .pg-gist").nth(3);
  await expect(entry).toHaveAttribute("target", "_blank");
  await expect(entry).toHaveAttribute("rel", "noopener noreferrer");
  const [popup] = await Promise.all([page.waitForEvent("popup"), entry.click()]);
  await expect.poll(() => popup.url()).toBe(data.gists[3].url);
});

test("GIST-03 gists meta", async ({ page }) => {
  await expect(page.locator("#gists .ds-section-meta")).toHaveText("5 ENTRIES");
  await expect(page.locator("#gists .ds-section-index")).toHaveText("SECTION 04");
});
