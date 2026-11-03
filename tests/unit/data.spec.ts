import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { certTree } from "../../src/model/derive";
import { validateData } from "../../src/model/validate";

const read = (rel: string) => JSON.parse(readFileSync(new URL(rel, import.meta.url), "utf8"));
const data = read("../../data.json");
const baseline = read("../fixtures/data-baseline.json");

test("DATA-03 data.json passes validation", () => {
  expect(() => validateData(data)).not.toThrow();
});

test("DATA-02 every pre-existing value is kept, in order", () => {
  for (const key of ["projects", "gists", "certifications", "social", "suite"]) {
    expect(data[key].length, key).toBe(baseline[key].length);
    baseline[key].forEach((old: unknown, i: number) => {
      if (typeof old === "object") expect(data[key][i], `${key}[${i}]`).toMatchObject(old as Record<string, unknown>);
      else expect(data[key][i], `${key}[${i}]`).toBe(old);
    });
  }
  expect(data.skills).toEqual(baseline.skills);
  expect(data.profile).toMatchObject(baseline.profile);
});

test("DATA-02 tools keep each category and name, in order", () => {
  const before = Object.entries(baseline.tools as Record<string, string[]>).flatMap(([category, names]) =>
    names.map((name) => [category, name]),
  );
  const after = (data.tools as { category: string; name: string }[]).map((t) => [t.category, t.name]);
  expect(after).toEqual(before);
});

test("DATA-01 additions hold the design values", () => {
  expect(data.profile.name).toBe("Gabriel O. Laureano");
  expect(data.profile.highlight).toBe("qa engineer");
  expect(data.social.find((s: { name: string }) => s.name === "github").id).toBe(43646296);
  expect(data.tools.filter((t: { active?: boolean }) => t.active).map((t: { name: string }) => t.name)).toEqual([
    "playwright",
  ]);
  expect(
    data.tools.map((t: { name: string; label: string; layer: number; angle: number }) => [
      t.name,
      t.label,
      t.layer,
      t.angle,
    ]),
  ).toEqual([
    ["playwright", "End-to-end tests", 1, -30],
    ["terraform", "Infrastructure as code", 3, -60],
    ["jenkins", "CI/CD", 2, 140],
    ["python", "Scripting", 1, 40],
    ["typescript", "Automation", 1, 200],
    ["docker", "Containers", 3, 60],
    ["git", "Version control", 2, -130],
  ]);
});

test("CERT-01 data.json certifications form CTFL, CTAL, then CT-TAS and CTAL-TM", () => {
  const tree = certTree(validateData(data).certifications);
  expect(tree?.code).toBe("CTFL");
  expect(tree?.children?.map((n) => n.code)).toEqual(["CTAL"]);
  expect(tree?.children?.[0].children?.map((n) => n.code)).toEqual(["CT-TAS", "CTAL-TM"]);
});
