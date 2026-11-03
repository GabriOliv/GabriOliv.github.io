import { expect, test } from "@playwright/test";
import { buildWith, dataFixture, previewOn } from "./helpers";

test("GIST-04 empty lists: projects and gists show title, count 0 and None on record.", async ({ page }) => {
  const build = buildWith(
    dataFixture((data) => {
      data.projects = [];
      data.gists = [];
    }),
  );
  expect(build.status, build.output).toBe(0);
  const server = await previewOn(build.outDir, 4174);
  try {
    await page.goto(server.url);
    const projects = page.locator("#projects");
    await expect(projects.locator(".ds-section-title")).toHaveText("PROJECTS");
    await expect(projects.locator(".ds-section-meta")).toHaveText("0 ENTRIES · 0 LIVE");
    await expect(projects.locator(".pg-note")).toHaveText("None on record.");
    await expect(projects.locator(".pg-entry")).toHaveCount(0);
    const gists = page.locator("#gists");
    await expect(gists.locator(".ds-section-title")).toHaveText("GISTS");
    await expect(gists.locator(".ds-section-meta")).toHaveText("0 ENTRIES");
    await expect(gists.locator(".pg-note")).toHaveText("None on record.");
    await expect(gists.locator(".pg-gist")).toHaveCount(0);
  } finally {
    server.stop();
  }
});

test("DATA-04 empty suite, tools, skills and certifications show None on record.", async ({ page }) => {
  const build = buildWith(
    dataFixture((data) => {
      data.suite = [];
      data.tools = [];
      data.skills = {};
      data.certifications = [];
    }),
  );
  expect(build.status, build.output).toBe(0);
  const server = await previewOn(build.outDir, 4177);
  try {
    await page.goto(server.url);
    const suite = page.locator("#suite");
    await expect(suite.locator(".pg-note")).toHaveText("None on record.");
    await expect(suite.locator(".pg-meter, .pg-checks, [role=status]")).toHaveCount(0);
    for (const t of ["tools", "certifications", "skills"]) {
      await expect(page.locator(`#pg-t-${t} .pg-note`), t).toHaveText("None on record.");
      await expect(page.locator(`#pg-t-${t} table`), t).toHaveCount(0);
    }
    const stack = page.locator("#stack");
    await expect(stack.locator(".ds-section-title")).toHaveText("STACK");
    await expect(stack.locator(".ds-section-meta")).toHaveText("0 TOOLS");
    await expect(stack.locator(".pg-note")).toHaveText("None on record.");
    await expect(stack.locator(".pg-fig")).toHaveCount(0);
    const certs = page.locator("#certs");
    await expect(certs.locator(".ds-section-title")).toHaveText("CERTIFICATIONS");
    await expect(certs.locator(".ds-section-meta")).toHaveText("0 ON RECORD");
    await expect(certs.locator(".pg-note")).toHaveText("None on record.");
    await expect(certs.locator(".ds-tree")).toHaveCount(0);
  } finally {
    server.stop();
  }
});
