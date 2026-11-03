import { expect, test } from "@playwright/test";
import { data } from "./data";

const live = (url: string) => url.toLowerCase().includes("github.io");

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("PROJ-01 project entries: data order, verbatim text, language tag, short URL", async ({ page }) => {
  const entries = page.locator("#projects .pg-entry");
  await expect(entries.locator(".pg-entry-name")).toHaveText(data.projects.map((p) => p.name));
  await expect(entries.locator(".pg-entry-desc")).toHaveText(data.projects.map((p) => p.description));
  await expect(entries.locator(".ds-tag:last-child")).toHaveText(data.projects.map((p) => p.language.toUpperCase()));
  await expect(entries.locator(".pg-entry-url")).toHaveText([
    "github.com/GabriOliv/chaos",
    "gabrioliv.github.io/garden",
    "gabrioliv.github.io/asciigraph",
    "gabrioliv.github.io/comparador-de-listas",
    "GabriOliv.github.io/gherkin-to-html",
    "github.com/GabriOliv/docker-clikit",
  ]);
});

test("PROJ-02 live and source: solid LIVE on github.io, outline SOURCE otherwise", async ({ page }) => {
  const first = page.locator("#projects .pg-entry .ds-tag:first-child");
  await expect(first).toHaveText(data.projects.map((p) => (live(p.url) ? "LIVE" : "SOURCE")));
  for (const [i, p] of data.projects.entries()) {
    await expect(first.nth(i)).toHaveClass(live(p.url) ? /ds-tag-solid/ : /ds-tag-outline/);
  }
  await expect(page.locator("#projects .ds-tag-solid")).toHaveCount(4);
});

test("PROJ-03 project opens its URL in a new tab", async ({ page, context }) => {
  await context.route(/^https:\/\/(?!127\.0\.0\.1)/, (route) => route.fulfill({ body: "ok" }));
  for (const i of [0, 4]) {
    const entry = page.locator("#projects .pg-entry").nth(i);
    await expect(entry).toHaveAttribute("target", "_blank");
    await expect(entry).toHaveAttribute("rel", "noopener noreferrer");
    const [popup] = await Promise.all([page.waitForEvent("popup"), entry.click()]);
    await expect.poll(() => popup.url()).toBe(new URL(data.projects[i].url).href);
    await popup.close();
  }
});

test("PROJ-04 projects meta", async ({ page }) => {
  await expect(page.locator("#projects .ds-section-meta")).toHaveText("6 ENTRIES · 4 LIVE");
  await expect(page.locator("#projects .ds-section-index")).toHaveText("SECTION 03");
});

test("PROJ-05 projects and gists as cards: two to a row from 560px, one below", async ({ page }) => {
  for (const sel of ["#projects .pg-entry", "#gists .pg-gist"]) {
    for (const [width, perRow] of [
      [1280, 2],
      [390, 1],
    ] as const) {
      await page.setViewportSize({ width, height: 800 });
      const [a, b] = [(await page.locator(sel).nth(0).boundingBox())!, (await page.locator(sel).nth(1).boundingBox())!];
      if (perRow === 2) {
        expect(Math.round(a.y), `${sel} at ${width}`).toBe(Math.round(b.y));
        expect(b.x, `${sel} at ${width}`).toBeGreaterThan(a.x + a.width);
      } else {
        expect(Math.round(a.x), `${sel} at ${width}`).toBe(Math.round(b.x));
        expect(b.y, `${sel} at ${width}`).toBeGreaterThan(a.y + a.height);
      }
    }
    await expect(page.locator(sel).first()).toHaveCSS("border-top-style", "solid");
  }
});
