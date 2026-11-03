import { expect, test } from "@playwright/test";
import { buildWith, dataFixture, previewOn } from "./helpers";

test("DATA-01 added entries: one more per list shows with only data.json changed", async ({ page }) => {
  const build = buildWith(
    dataFixture((data) => {
      data.projects.push({
        name: "extra-project",
        url: "https://example.com/x",
        description: "Extra project.",
        language: "Rust",
      });
      data.gists.push({ name: "extra-gist", url: "https://example.com/g", description: "Extra gist.", language: "Go" });
      data.certifications.push({
        name: "CT-EXTRA",
        issuer: "istqb",
        type: "certification",
        level: "advanced",
        focus: "Extra Focus",
        requires: "CTFL",
      });
      data.tools.push({ name: "extratool", category: "x", label: "Extra label", layer: 2, angle: 10 });
      data.skills.extra_skill = "primary";
      data.suite.push("extra_check");
      data.social.push({ name: "mastodon", handle: "@extra", url: "https://example.com/@extra" });
      data.profile.roles.push("extra role");
    }),
  );
  expect(build.status, build.output).toBe(0);
  const server = await previewOn(build.outDir, 4175);
  try {
    await page.goto(server.url);
    await expect(page.locator("#projects .pg-entry-name").last()).toHaveText("extra-project");
    await expect(page.locator("#gists .pg-gist-name").last()).toHaveText("extra-gist");
    await expect(page.locator("#pg-t-certifications tbody th").last()).toHaveText("CT-EXTRA");
    await expect(page.locator("#certs .ds-tree > ul > li > ul > li > .ds-tree-node .ds-tree-code")).toHaveText([
      "CTAL",
      "CT-EXTRA",
    ]);
    await expect(page.locator("#pg-t-tools tbody th").last()).toHaveText("extratool");
    await expect(page.locator("#stack .ds-sch-text").last()).toHaveText("EXTRATOOL");
    await expect(page.locator("#pg-t-skills tbody th").last()).toHaveText("extra_skill");
    await expect(page.locator("#suite .pg-meter > span")).toHaveCount(4);
    await expect(page.locator("#suite .pg-check-name").last()).toHaveText("extra_check");
    await expect(page.locator(".pg-contact .pg-k").last()).toHaveText("mastodon");
    await expect(page.locator(".pg-contact .pg-sr")).toHaveText(/, extra role$/);
    await expect(page.locator(".ds-header-metatext")).toHaveText("SUITE 4/4 PASS");
  } finally {
    server.stop();
  }
});
