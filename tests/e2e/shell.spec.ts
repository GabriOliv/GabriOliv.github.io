import { expect, test } from "@playwright/test";

const SCRIPT = "**/assets/*.js";

test("PAGE-10 loading line shows until the script mounts", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((r) => (release = r));
  await page.route(SCRIPT, async (route) => {
    await held;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("#pg-loading")).toHaveText("Opening file…");
  release();
  await expect(page.locator("main.pg-main")).toBeAttached();
  await expect(page.locator("#pg-loading")).toHaveCount(0);
});

test("PAGE-11 script failure names the script in the loading line", async ({ page }) => {
  await page.route(SCRIPT, (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("#pg-loading")).toHaveText(
    /^The file did not open\. Reason: could not load http:\/\/127\.0\.0\.1:4173\/assets\/index-[\w-]+\.js$/,
  );
});

test("PAGE-11 script not mounted within 10 s names the timeout", async ({ page }) => {
  await page.clock.install();
  await page.route(SCRIPT, () => {
    /* never answered: the script stays pending */
  });
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("#pg-loading")).toHaveText("Opening file…");
  // Parsing ends after the inline watcher has run, so its 10 s timer exists before time moves.
  await expect.poll(() => page.evaluate(() => document.readyState)).not.toBe("loading");
  await page.clock.fastForward(10_000);
  await expect(page.locator("#pg-loading")).toHaveText(
    "The file did not open. Reason: the scripts did not finish loading within 10 s.",
  );
});

test("PAGE-11 the first reason stays after the 10 s timer", async ({ page }) => {
  await page.clock.install();
  await page.route(SCRIPT, (route) => route.abort());
  await page.goto("/");
  const loading = page.locator("#pg-loading");
  await expect(loading).toHaveText(
    /^The file did not open\. Reason: could not load http:\/\/127\.0\.0\.1:4173\/assets\//,
  );
  await page.clock.fastForward(11_000);
  await expect(loading).toHaveText(
    /^The file did not open\. Reason: could not load http:\/\/127\.0\.0\.1:4173\/assets\//,
  );
});

test("PAGE-11 render failure names the error in the loading line", async ({ page }) => {
  // Suite reads this query while rendering; the inline theme script only asks for the colour scheme.
  await page.addInitScript(() => {
    const real = window.matchMedia.bind(window);
    window.matchMedia = (query: string) => {
      if (query === "(prefers-reduced-motion: reduce)") throw new Error("render broke on purpose");
      return real(query);
    };
  });
  await page.goto("/");
  await expect(page.locator("#pg-loading")).toHaveText(/^The file did not open\. Reason: \S.*$/);
});

test("PAGE-03 document title is profile.name", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Gabriel O. Laureano");
});

test.describe("dark colour scheme", () => {
  test.use({ colorScheme: "dark" });
  test("THEME-05 follows OS: dark opens Void", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "void");
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(10, 11, 13)");
  });
});

test.describe("light colour scheme", () => {
  test.use({ colorScheme: "light" });
  test("THEME-05 follows OS: light opens Paper", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "paper");
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(244, 244, 241)");
  });
});
