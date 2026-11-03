import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { buildWith } from "./helpers";

test("BUILD-04 root base: every asset URL starts with /assets/", () => {
  const build = buildWith("data.json");
  expect(build.status, build.output).toBe(0);
  const html = readFileSync(join(build.outDir, "index.html"), "utf8");
  const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]).filter((u) => !u.startsWith("http"));
  expect(urls.length).toBeGreaterThanOrEqual(2);
  for (const url of urls) expect(url).toMatch(/^\/assets\//);
});
