import { expect, test, type Page } from "@playwright/test";

const IDS = ["certs", "stack", "projects", "gists"];
const tabs = (page: Page) => page.locator("nav.pg-bar .pg-tabs a");
const current = (page: Page) => page.locator('nav.pg-bar a[aria-current="true"]');

const scrollTopOf = (page: Page, id: string, offset: number) =>
  page.evaluate(
    ([id, offset]) =>
      window.scrollTo(
        0,
        document.getElementById(id as string)!.getBoundingClientRect().top + window.scrollY - (offset as number),
      ),
    [id, offset],
  );

const progressScale = (page: Page) =>
  page.locator(".pg-progress").evaluate((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).a);

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#gists")).toBeAttached();
});

test("NAV-01 sticky tabs: HOME, CERTS, STACK, PROJECTS, GISTS and the theme switch stay at the top", async ({
  page,
}) => {
  await expect(tabs(page)).toHaveText(["Home", "Certs", "Stack", "Projects", "Gists"]);
  expect(await page.locator("nav.pg-bar .pg-tabs").innerText()).toMatch(/^HOME\s+CERTS\s+STACK\s+PROJECTS\s+GISTS$/);
  await expect(page.locator("nav.pg-bar .pg-themes button")).toHaveCount(3);
  await expect(tabs(page).nth(0)).toHaveAttribute("href", "#");
  for (const [i, id] of IDS.entries()) await expect(tabs(page).nth(i + 1)).toHaveAttribute("href", "#" + id);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  const box = await page.locator("nav.pg-bar").boundingBox();
  expect(box?.y).toBe(0);
});

test("NAV-02 tab scrolls its section just below the bar @smoke", async ({ page }) => {
  for (const [i, id] of IDS.entries()) {
    await tabs(page)
      .nth(i + 1)
      .click();
    const barBottom = (await page.locator("nav.pg-bar").boundingBox())!;
    const top = await page.locator("#" + id).evaluate((e) => e.getBoundingClientRect().top);
    const atBottom = await page.evaluate(
      () => window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2,
    );
    const below = barBottom.y + barBottom.height;
    if (atBottom) {
      // The page cannot scroll further: the section is in view, below the bar.
      expect(top, id).toBeGreaterThanOrEqual(below - 1);
      expect(top, id).toBeLessThan(page.viewportSize()!.height);
    } else {
      expect(top, id).toBeGreaterThanOrEqual(below - 1);
      expect(top, id).toBeLessThanOrEqual(below + 24);
    }
  }
});

test("NAV-03 current tab: the last section at or above 90 px, else Home", async ({ page }) => {
  await expect(current(page)).toHaveText("Home");
  await scrollTopOf(page, "stack", 50);
  await expect(current(page)).toHaveText("Stack");
  await expect(current(page)).toHaveCSS(
    "color",
    await page
      .locator(".ds-section-index")
      .first()
      .evaluate((e) => getComputedStyle(e).color),
  );
  await scrollTopOf(page, "certs", 85);
  await expect(current(page)).toHaveText("Certs");
  await scrollTopOf(page, "projects", 100);
  await expect(current(page)).toHaveText("Stack");
});

test("NAV-03 the 90 px line: 90 marks the tab, 91 does not, underline in signal", async ({ page }) => {
  const stack = page.locator("#stack");
  const top = () => stack.evaluate((e) => e.getBoundingClientRect().top);
  // Window scroll offsets are whole pixels but the section's top is not: move #stack by under half a pixel so
  // its top can sit exactly on the line.
  await stack.evaluate((e) => {
    const y = e.getBoundingClientRect().top + window.scrollY;
    e.style.transform = `translateY(${Math.round(y) - y}px)`;
  });
  const signal = await page
    .locator(".ds-section-index")
    .first()
    .evaluate((e) => getComputedStyle(e).color);
  await scrollTopOf(page, "stack", 90);
  expect(await top()).toBe(90);
  await expect(current(page)).toHaveText("Stack");
  await expect(current(page)).toHaveCSS("border-bottom-color", signal);
  await expect(tabs(page).nth(1)).toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");
  await scrollTopOf(page, "stack", 91);
  expect(await top()).toBe(91);
  await expect(current(page)).toHaveText("Certs");
});

test("NAV-06 home tab scrolls to the page top and is current there", async ({ page }) => {
  await scrollTopOf(page, "projects", 50);
  await expect(current(page)).toHaveText("Projects");
  await tabs(page).nth(0).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(current(page)).toHaveText("Home");
});

test("NAV-04 bottom marks gists", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(current(page)).toHaveText("Gists");
});

test("NAV-05 progress line fills to scroll over scrollable height", async ({ page }) => {
  await expect.poll(() => progressScale(page)).toBe(0);
  const half = await page.evaluate(() => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(total / 2));
    return window.scrollY / total;
  });
  await expect.poll(async () => Math.abs((await progressScale(page)) - half)).toBeLessThan(0.01);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => progressScale(page)).toBe(1);
});

test("MOB-03 tab bar scroll: tabs stay on one line and scroll inside the bar", async ({ page }) => {
  const oneLine = async () => {
    const tops = await tabs(page).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
  };
  await page.setViewportSize({ width: 320, height: 700 });
  await oneLine();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  // Narrower than the tabs: the bar scrolls inside itself and never widens the page.
  await page.setViewportSize({ width: 240, height: 700 });
  await oneLine();
  const [scroll, client] = await page.locator(".pg-tabs").evaluate((e) => [e.scrollWidth, e.clientWidth]);
  expect(scroll).toBeGreaterThan(client);
  const bar = (await page.locator("nav.pg-bar").boundingBox())!;
  expect(Math.round(bar.width)).toBeLessThanOrEqual(240);
  await expect(page.locator(".pg-tabs")).toHaveCSS("overflow-x", /^(auto|scroll)$/);
  const [left, pageX] = await page.locator(".pg-tabs").evaluate((e) => {
    e.scrollLeft = 200;
    return [e.scrollLeft, window.scrollX];
  });
  expect(left, "the bar scrolls").toBeGreaterThan(0);
  expect(pageX, "the page does not").toBe(0);
});
