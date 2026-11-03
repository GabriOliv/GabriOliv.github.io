import { expect, test, type Page } from "@playwright/test";
import { data } from "./data";

const rows = (page: Page) => page.locator("#suite .pg-checks li");
const passed = (page: Page) => page.locator("#suite .pg-check-pass");
const button = (page: Page) => page.locator("#suite-run");
const note = (page: Page) => page.locator("#suite [role=status]");
const clock = (page: Page) => page.locator("#suite .pg-suite-head b");

test.describe("with timers under test control", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(60_000); // well past install time, before any page timer exists
    await page.goto("/");
    await expect(rows(page)).toHaveCount(3);
  });

  test("SUITE-01 test suite: one segment and one row per suite entry, text verbatim", async ({ page }) => {
    await expect(page.locator("#suite .pg-suite-head span")).toHaveText("Test suite");
    await expect(page.locator("#suite .pg-meter > span")).toHaveCount(data.suite.length);
    await expect(page.locator("#suite .pg-check-name")).toHaveText(data.suite);
    await expect(page.locator("#suite .pg-check-state")).toHaveText(["run", "wait", "wait"]);
    await expect(clock(page)).toHaveText("0/3 · 0.00s");
  });

  test("SUITE-02 timed passes: one more PASS every 700 ms", async ({ page }) => {
    await expect(passed(page)).toHaveCount(0);
    await page.clock.runFor(699);
    await expect(passed(page)).toHaveCount(0);
    for (const count of [1, 2, 3]) {
      await page.clock.runFor(count === 1 ? 1 : 700);
      await expect(passed(page)).toHaveCount(count);
    }
  });

  test("SUITE-03 while running: spinner on the running row, button disabled, clock and note", async ({ page }) => {
    await page.clock.runFor(700);
    await expect(passed(page)).toHaveCount(1);
    await expect(page.locator("#suite .pg-check-state")).toHaveText(["pass", "run", "wait"]);
    await expect(page.locator("#suite .pg-check-run > span").first()).toHaveText(/^[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]$/);
    await expect(button(page)).toBeDisabled();
    await expect(clock(page)).toHaveText("1/3 · 0.70s");
    await expect(note(page)).toHaveText("Suite running.");
  });

  test("SUITE-04 suite done: RUN AGAIN enabled, 3 passed, 0 failed", async ({ page }) => {
    await page.clock.runFor(3 * 700);
    await expect(passed(page)).toHaveCount(3);
    await expect(button(page)).toBeEnabled();
    expect(await button(page).innerText()).toBe("RUN AGAIN");
    await expect(clock(page)).toHaveText("3/3 · 2.10s");
    await expect(note(page)).toHaveText("3 passed · 0 failed");
  });

  test("SUITE-05 run again resets every row and reruns", async ({ page }) => {
    await page.clock.runFor(3 * 700);
    await expect(passed(page)).toHaveCount(3);
    await button(page).click();
    await expect(passed(page)).toHaveCount(0);
    await expect(page.locator("#suite .pg-check-state")).toHaveText(["run", "wait", "wait"]);
    await expect(button(page)).toBeDisabled();
    await page.clock.runFor(3 * 700);
    await expect(passed(page)).toHaveCount(3);
    await expect(note(page)).toHaveText("3 passed · 0 failed");
  });
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("SUITE-06 reduced motion shows every check passed at once", async ({ page }) => {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(60_000); // well past install time, before any page timer exists
    await page.goto("/");
    await expect(passed(page)).toHaveCount(3);
    await expect(button(page)).toBeEnabled();
    await expect(note(page)).toHaveText("3 passed · 0 failed");
    await button(page).click();
    await expect(passed(page)).toHaveCount(3);
  });
});
