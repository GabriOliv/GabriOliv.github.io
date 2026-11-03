import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const workflow = readFileSync(".github/workflows/pages.yml", "utf8");
const IMAGE = "mcr.microsoft.com/playwright:v1.64.1-noble";

/** The `uses:` and `run:` values of every step, in file order. */
const steps = [...workflow.matchAll(/^\s+(?:- )?(?:uses|run): (.+)$/gm)].map((m) => m[1].trim());

/** The text of one job, from its key to the next top-level job key. */
function job(name: string): string {
  const m = workflow.match(new RegExp(`^  ${name}:\\n([\\s\\S]*?)(?=^  \\S|(?![\\s\\S]))`, "m"));
  expect(m, `job ${name}`).not.toBeNull();
  return m![1];
}

test("CI-01 workflow order: push to master builds, tests dist, then deploys it", () => {
  expect(workflow).toMatch(/^on:\n  push:\n    branches: \[master\]\n/m);
  expect(steps).toEqual([
    "actions/checkout@v5",
    "npm ci",
    "npm run build",
    "npm run test:built",
    "actions/upload-pages-artifact@v5",
    "actions/deploy-pages@v5",
  ]);
  expect(job("build-test")).toMatch(/uses: actions\/upload-pages-artifact@v5\n\s+with:\n\s+path: dist\n/);
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  expect(pkg.scripts["test:built"]).toBe("playwright test");
  expect(pkg.scripts.build).toBe("tsc --noEmit && vite build");
});

test("CI-02 tests gate deploy: deploy needs build-test, no step ignores failure", () => {
  expect(job("deploy")).toMatch(/^    needs: build-test$/m);
  expect(workflow).not.toMatch(/continue-on-error/);
  expect(workflow).not.toMatch(/^\s+if:/m);
});

test("CI-03 build gates deploy: build runs before tests in the job deploy needs", () => {
  const build = job("build-test");
  expect(build.indexOf("run: npm run build")).toBeGreaterThan(-1);
  expect(build.indexOf("run: npm run build")).toBeLessThan(build.indexOf("run: npm run test:built"));
  expect(job("deploy")).not.toMatch(/npm/);
});

test("CI-04 concurrency: one deploy at a time, none cancelled", () => {
  expect(workflow).toMatch(/^concurrency:\n  group: pages\n  cancel-in-progress: false\n/m);
  expect(workflow).toMatch(/^permissions:\n  contents: read\n  pages: write\n  id-token: write\n/m);
});

test("BUILD-05 one image: compose and the workflow run Node in the Playwright image", () => {
  expect(job("build-test")).toContain(`image: ${IMAGE}`);
  expect(readFileSync("compose.yaml", "utf8")).toContain(`image: ${IMAGE}`);
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  expect(`mcr.microsoft.com/playwright:v${pkg.devDependencies["@playwright/test"]}-noble`).toBe(IMAGE);
});
