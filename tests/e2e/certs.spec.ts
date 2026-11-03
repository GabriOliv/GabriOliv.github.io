import { expect, test } from "@playwright/test";

const level = (depth: number) => "#certs .ds-tree > ul" + " > li > ul".repeat(depth) + " > li > .ds-tree-node";

test.use({ colorScheme: "light" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("CERT-01 hierarchy tree: CTFL, then CTAL, then CT-TAS and CTAL-TM", async ({ page }) => {
  await expect(page.locator(level(0) + " .ds-tree-code")).toHaveText(["CTFL"]);
  await expect(page.locator(level(0) + " .ds-tree-label")).toHaveText(["Foundation"]);
  await expect(page.locator(level(0))).toHaveClass(/ds-tree-root/);
  await expect(page.locator(level(1) + " .ds-tree-code")).toHaveText(["CTAL"]);
  await expect(page.locator(level(1) + " .ds-tree-label")).toHaveText(["Advanced"]);
  await expect(page.locator(level(2) + " .ds-tree-code")).toHaveText(["CT-TAS", "CTAL-TM"]);
  await expect(page.locator(level(2) + " .ds-tree-label")).toHaveText(["Test Automation Strategy", "Test Management"]);
  await expect(page.locator("#certs .ds-tree-node")).toHaveCount(4);
});

test("CERT-01 sideways: root at the left, each level further right, siblings stacked", async ({ page }) => {
  const box = async (sel: string, i = 0) => (await page.locator(sel).nth(i).boundingBox())!;
  const [root, mid, a, b] = [await box(level(0)), await box(level(1)), await box(level(2), 0), await box(level(2), 1)];
  expect(mid.x).toBeGreaterThan(root.x + root.width);
  expect(a.x).toBeGreaterThan(mid.x + mid.width);
  expect(Math.round(a.x)).toBe(Math.round(b.x));
  expect(b.y).toBeGreaterThanOrEqual(a.y + a.height);
  expect(Math.abs(root.y + root.height / 2 - (mid.y + mid.height / 2))).toBeLessThanOrEqual(1);
});

test("CERT-01 emphasis: CT-TAS and CTAL-TM in signal, CTFL plain", async ({ page }) => {
  await expect(page.locator("#certs .ds-tree-on .ds-tree-code")).toHaveText(["CT-TAS", "CTAL-TM"]);
  for (const i of [0, 1]) await expect(page.locator(level(2)).nth(i)).toHaveCSS("background-color", "rgb(0, 47, 167)");
  await expect(page.locator(level(0))).toHaveCSS("background-color", "rgb(244, 244, 241)");
  await expect(page.locator(level(0))).toHaveCSS("color", "rgb(11, 12, 14)");
});

test("CERT-02 no caption under the hierarchy", async ({ page }) => {
  await expect(page.locator("#certs .ds-tree")).toBeVisible();
  await expect(page.locator("#certs figcaption, #certs .pg-note, #certs caption")).toHaveCount(0);
});

test("CERT-04 cert meta", async ({ page }) => {
  await expect(page.locator("#certs .ds-section-meta")).toHaveText("ISTQB · 4 ON RECORD");
  await expect(page.locator("#certs .ds-section-index")).toHaveText("SECTION 01");
});

test("CERT-05 tree frame scroll: at 320 the tree scrolls in its frame, not the page", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  const tree = page.locator("#certs .ds-tree");
  const [scroll, client] = await tree.evaluate((e) => [e.scrollWidth, e.clientWidth]);
  expect(scroll, "tree wider than its frame at 320").toBeGreaterThan(client);
  await expect(tree).toHaveCSS("overflow-x", "auto");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
