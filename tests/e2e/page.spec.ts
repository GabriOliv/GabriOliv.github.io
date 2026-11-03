import { expect, test, type Page } from "@playwright/test";
import { data } from "./data";

const sideways = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

/** How many IBM Plex faces load for each family Dossier uses (0 when none is declared or reachable). */
const plexFacesLoaded = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      ['700 32px "IBM Plex Sans Condensed"', '400 14px "IBM Plex Sans"', '500 11px "IBM Plex Mono"'].map((f) =>
        document.fonts.load(f).then(
          (faces) => faces.length,
          () => 0,
        ),
      ),
    ),
  );

test("PAGE-01 Dossier fonts load from Google Fonts", async ({ page }) => {
  await page.goto("/");
  const loaded = await plexFacesLoaded(page);
  for (const n of loaded) expect(n).toBeGreaterThan(0);
});

test("PAGE-02 column at most 760px, centred at 1280", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const box = (await page.locator("main.pg-main").boundingBox())!;
  expect(box.width).toBeLessThanOrEqual(760);
  expect(Math.abs(box.x - (1280 - box.width) / 2)).toBeLessThanOrEqual(1);
});

test("PAGE-12 no horizontal scroll at 390 @smoke", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("#gists")).toBeAttached();
  expect(await sideways(page)).toBeLessThanOrEqual(0);
});

test("PAGE-12 no horizontal scroll at 320 and 1280", async ({ page }) => {
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await expect(page.locator("#gists")).toBeAttached();
    expect(await sideways(page), `width ${width}`).toBeLessThanOrEqual(0);
  }
});

test("PAGE-13 fonts blocked: every section still renders", async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  await page.goto("/");
  for (const sel of [".ds-header-title", "#suite", "#stack", "#certs", "#projects", "#gists", "footer.pg-end"]) {
    await expect(page.locator(sel)).toBeVisible();
  }
  expect(await plexFacesLoaded(page)).toEqual([0, 0, 0]);
  expect(await sideways(page)).toBeLessThanOrEqual(0);
});

test("PAGE-15 focus ring on keyboard focus of a link, a tab and a button", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const ring =
    /rgb\(\d+, \d+, \d+\) 0px 0px 0px 2px, rgb\(0, 47, 167\) 0px 0px 0px 4px|rgb\(\d+, \d+, \d+\) 0px 0px 0px 2px, rgb\(43, 127, 255\) 0px 0px 0px 4px/;
  for (const sel of [
    "nav.pg-bar .pg-tabs a >> nth=1",
    ".pg-contact a >> nth=0",
    "#theme-void",
    "#gists .pg-gist >> nth=0",
  ]) {
    const el = page.locator(sel);
    await el.focus();
    await expect(el, sel).toBeFocused();
    expect(await el.evaluate((e) => getComputedStyle(e).boxShadow), sel).toMatch(ring);
  }
});

test("PAGE-16 section order: Certifications, Stack, Projects, Gists @smoke", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main > section")).toHaveCount(4);
  expect(await page.locator("main > section").evaluateAll((els) => els.map((e) => e.id))).toEqual([
    "certs",
    "stack",
    "projects",
    "gists",
  ]);
  await expect(page.locator("main > section .ds-section-index")).toHaveText([
    "SECTION 01",
    "SECTION 02",
    "SECTION 03",
    "SECTION 04",
  ]);
  await expect(page.locator("main > section .ds-section-title")).toHaveText([
    "CERTIFICATIONS",
    "STACK",
    "PROJECTS",
    "GISTS",
  ]);
  expect(await page.locator("main > *").evaluateAll((els) => els.map((e) => e.className || e.id))).toEqual([
    "pg-file",
    "pg-block",
    "pg-block",
    "pg-block",
    "pg-block",
    "pg-end",
  ]);
});

test("DATA-02 verbatim text: data.json strings print unchanged except letter case", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#gists")).toBeAttached();
  const text = (await page.locator("body").textContent()) ?? "";
  const shown = [
    data.profile.focus,
    data.profile.education,
    ...data.profile.roles,
    ...data.social.map((s) => s.handle),
    ...data.suite,
    ...data.tools.flatMap((t) => [t.label]),
    ...Object.entries(data.skills).flat(),
    ...data.certifications.flatMap((c) => [c.name, c.focus]),
    ...[...data.projects, ...data.gists].flatMap((e) => [e.name, e.description]),
  ];
  for (const s of shown) expect(text, s).toContain(s);
  const upper = text.toUpperCase();
  for (const s of [
    data.profile.name,
    ...data.social.map((s) => s.name),
    ...data.tools.map((t) => t.name),
    ...[...data.projects, ...data.gists].map((e) => e.language),
  ]) {
    expect(upper, s).toContain(s.toUpperCase());
  }
});
