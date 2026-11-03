import { expect, test, type Page } from "@playwright/test";
import { data } from "./data";

const outerDiameter = async (page: Page) =>
  2 * Number(await page.locator("#stack .ds-sch-ring:not(.ds-sch-ring-inner)").getAttribute("r"));

/** An angle in degrees normalised to (-180, 180]. */
const degrees = (a: number) => {
  const r = ((a % 360) + 360) % 360;
  return r > 180 ? r - 360 : r;
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("STACK-01 schematic nodes: 3 rings, each tool on its layer, playwright in signal", async ({ page }) => {
  await expect(page.locator("#stack .ds-sch-ring")).toHaveCount(3);
  const nodes = page.locator("#stack .ds-sch-node");
  await expect(nodes).toHaveCount(7);
  const core = page.locator("#stack .ds-sch-core");
  const [cx, cy] = [Number(await core.getAttribute("cx")), Number(await core.getAttribute("cy"))];
  const R = (await outerDiameter(page)) / 2;
  for (const [i, tool] of data.tools.entries()) {
    const node = nodes.nth(i);
    const [nx, ny] = [Number(await node.getAttribute("cx")), Number(await node.getAttribute("cy"))];
    const dist = Math.hypot(nx - cx, ny - cy);
    expect(dist, tool.name).toBeCloseTo((R * tool.layer) / 3, 3);
    const angle = (Math.atan2(ny - cy, nx - cx) * 180) / Math.PI;
    expect(Math.abs(degrees(angle) - degrees(tool.angle)), `${tool.name} angle`).toBeLessThanOrEqual(0.5);
  }
  await expect(page.locator("#stack .ds-sch-text")).toHaveText(data.tools.map((t) => t.name.toUpperCase()));
  await expect(page.locator("#stack .ds-sch-node-on")).toHaveCount(1);
  await expect(page.locator("#stack .ds-sch-on-text")).toHaveText("PLAYWRIGHT");
});

test("STACK-02 schematic caption", async ({ page }) => {
  await expect(page.locator("#stack figcaption")).toHaveText(
    "Fig. 1. Tools by layer. Inner ring: test code. Middle ring: delivery. Outer ring: infrastructure.",
  );
});

test("STACK-05 stack meta", async ({ page }) => {
  await expect(page.locator("#stack .ds-section-meta")).toHaveText("7 TOOLS");
  await expect(page.locator("#stack .ds-fields, #stack .pg-bullets, #stack table")).toHaveCount(0);
});

test("STACK-06 schematic resize: ring diameter fits the column, 120 to 260", async ({ page }) => {
  for (const [width, diameter] of [
    [1280, 260],
    [390, 170],
    [320, 120],
  ]) {
    await page.setViewportSize({ width, height: 800 });
    await expect.poll(() => outerDiameter(page), `width ${width}`).toBe(diameter);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `page scrolls sideways at ${width}`).toBeLessThanOrEqual(0);
  }
});
