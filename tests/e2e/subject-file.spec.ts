import { expect, test } from "@playwright/test";
import { data } from "./data";

test.use({ colorScheme: "light" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("PAGE-03 header title is profile.name @smoke", async ({ page }) => {
  await expect(page.locator("#pg-loading")).toHaveCount(0);
  await expect(page.locator(".ds-header-title")).toHaveText("GABRIEL O. LAUREANO");
});

test("PAGE-04 file code: random 8-digit file hash and 7-digit rev hash, new on each load", async ({ page }) => {
  const code = page.locator(".ds-header-code");
  const files = new Set<string>();
  const revs = new Set<string>();
  for (let i = 0; i < 5; i++) {
    if (i) await page.reload();
    const text = (await code.textContent()) ?? "";
    const [, file, rev] = text.match(/^FILE ([0-9A-F]{8}) · REV ([0-9A-F]{7})$/) ?? [];
    expect(file, text).toBeTruthy();
    files.add(file);
    revs.add(rev);
  }
  expect(files.size).toBeGreaterThan(1);
  expect(revs.size).toBeGreaterThan(1);
});

test("PAGE-05 suite meta counts the suite entries", async ({ page }) => {
  await expect(page.locator(".ds-header-metatext")).toHaveText("SUITE 3/3 PASS");
  await expect(page.locator(".ds-header-kicker")).toHaveText("SUBJECT FILE");
});

test("PAGE-06 role typer: types each role on one line, highlight in signal, full list for screen readers", async ({
  page,
}) => {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(60_000); // well past install time, before any page timer exists
  await page.goto("/");
  await expect(page.locator(".pg-contact .pg-sr")).toHaveText(data.profile.roles.join(", "));
  const typed = page.locator(".pg-typer > span:first-child");
  await expect(page.locator(".pg-typer")).toHaveAttribute("aria-hidden", "true");
  const first = data.profile.roles[0];
  await page.clock.runFor(90 * first.length);
  await expect(typed).toHaveText(first);
  await expect(typed).not.toHaveClass(/pg-hl/);
  const seen = [first];
  for (let i = 0; i < 1000 && seen.length < data.profile.roles.length; i++) {
    await page.clock.runFor(50);
    const text = (await typed.textContent()) ?? "";
    if (data.profile.roles.includes(text) && seen.at(-1) !== text) seen.push(text);
    if (text === data.profile.highlight) break;
  }
  expect(seen).toEqual(data.profile.roles.slice(0, seen.length));
  await expect(typed).toHaveText(data.profile.highlight);
  await expect(typed).toHaveClass(/pg-hl/);
  await expect(typed).toHaveCSS("color", "rgb(0, 47, 167)");
  const lines = await page.locator(".pg-typer").evaluate((e) => Math.round(e.getBoundingClientRect().height));
  expect(lines).toBeLessThanOrEqual(24);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("PAGE-06 reduced motion shows the highlight role, still", async ({ page }) => {
    await page.goto("/");
    const typed = page.locator(".pg-typer > span:first-child");
    await expect(typed).toHaveText(data.profile.highlight);
    await page.waitForTimeout(500);
    await expect(typed).toHaveText(data.profile.highlight);
  });
});

test("PAGE-07 qafetch lines: name, role, focus, edu, then one line per social link", async ({ page }) => {
  const keys = page.locator(".pg-contact .pg-k");
  await expect(keys).toHaveText(["name", "role", "focus", "edu", ...data.social.map((s) => s.name)]);
  await expect(page.locator(".pg-contact .pg-prompt")).toHaveText("laureano@qa:~$ qafetch");
  const values = page.locator(".pg-contact .pg-v");
  await expect(values.nth(0)).toHaveText(data.profile.name);
  await expect(values.nth(2)).toHaveText(data.profile.focus);
  await expect(values.nth(3)).toHaveText(data.profile.education);
  for (const [i, s] of data.social.entries()) {
    const link = values.nth(i + 4).locator("a");
    await expect(link).toHaveText(s.handle);
    await expect(link).toHaveAttribute("href", s.url);
  }
});

test("PAGE-08 no readouts and no theme row in the subject file", async ({ page }) => {
  await expect(page.locator(".pg-file .ds-readout, .pg-file .pg-themes, .pg-file .ds-statement")).toHaveCount(0);
});

test("STACK-03 tools table: name beside use, active tool's row tinted", async ({ page }) => {
  const rows = page.locator("#pg-t-tools tbody tr");
  await expect(page.locator("#pg-t-tools thead th")).toHaveText(["name", "use"]);
  await expect(rows.locator("th")).toHaveText(data.tools.map((t) => t.name));
  await expect(rows.locator("td")).toHaveText(data.tools.map((t) => t.label));
  await expect(page.locator("#pg-t-tools tr.pg-on th")).toHaveText(
    data.tools.filter((t) => t.active).map((t) => t.name),
  );
});

test("CERT-03 certifications table: code beside focus, top certifications tinted, before skills", async ({ page }) => {
  const rows = page.locator("#pg-t-certifications tbody tr");
  await expect(rows.locator("th")).toHaveText(data.certifications.map((c) => c.name));
  await expect(rows.locator("td")).toHaveText(data.certifications.map((c) => c.focus));
  await expect(page.locator("#pg-t-certifications tr.pg-on th")).toHaveText(["CT-TAS", "CTAL-TM"]);
  await expect(page.locator(".pg-pane-tables .pg-mini-cap")).toHaveText(["tools", "certifications", "skills"]);
});

test("STACK-04 skills table: every skill with its level, verbatim", async ({ page }) => {
  const rows = page.locator("#pg-t-skills tbody tr");
  await expect(rows.locator("th")).toHaveText(Object.keys(data.skills));
  await expect(rows.locator("td")).toHaveText(Object.values(data.skills));
});

test("PAGE-17 qafetch layout: suite across the top, profile and tables side by side from 640px", async ({ page }) => {
  for (const [width, side] of [
    [1280, true],
    [390, false],
  ] as const) {
    await page.setViewportSize({ width, height: 800 });
    const [run, profile, tables] = await Promise.all(
      ["#suite", ".pg-contact", ".pg-pane-tables"].map(async (s) => (await page.locator(s).boundingBox())!),
    );
    expect(run.y + run.height, `suite on top at ${width}`).toBeLessThanOrEqual(profile.y + 1);
    if (side) {
      expect(Math.round(profile.y)).toBe(Math.round(tables.y));
      expect(tables.x).toBeGreaterThan(profile.x);
    } else expect(tables.y).toBeGreaterThanOrEqual(profile.y + profile.height - 1);
  }
});

test("PAGE-14 external links: contact links open in a new tab safely", async ({ page }) => {
  const links = page.locator(".pg-contact a");
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});
