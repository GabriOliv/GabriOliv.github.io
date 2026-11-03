import { expect, test } from "@playwright/test";
import { validateData } from "../../src/model/validate";

function valid() {
  return {
    profile: {
      name: "Gabriel O. Laureano",
      roles: ["computer scientist", "qa engineer"],
      highlight: "qa engineer",
      focus: "software testing",
      education: "computer science",
    },
    social: [{ name: "github", handle: "GabriOliv", url: "https://github.com/gabrioliv", id: 43646296 }],
    suite: ["computer_science", "software_testing"],
    tools: [
      { name: "playwright", category: "e2e", label: "End-to-end tests", layer: 1, angle: -30, active: true },
      { name: "git", category: "vcs", label: "Version control", layer: 2, angle: -130 },
    ],
    skills: { documentation: "primary" },
    certifications: [
      { name: "CTFL", issuer: "istqb", type: "certification", level: "foundation", focus: "Foundation" },
      { name: "CTAL", issuer: "istqb", type: "validation", level: "advanced", focus: "Advanced", requires: "CTFL" },
      { name: "CT-TAS", issuer: "istqb", type: "certification", level: "advanced", focus: "TAS", requires: "CTAL" },
      { name: "CTAL-TM", issuer: "istqb", type: "certification", level: "advanced", focus: "TM", requires: "CTAL" },
    ],
    projects: [
      { name: "garden", url: "https://gabrioliv.github.io/garden/", description: "Notes", language: "TypeScript" },
    ],
    gists: [{ name: "pre-push", url: "https://gist.github.com/x", description: "Hook", language: "Shell" }],
  };
}

function messageOf(raw: unknown): string {
  try {
    validateData(raw);
  } catch (e) {
    return (e as Error).message;
  }
  return "no error";
}

test("DATA-03 valid data is returned unchanged", () => {
  const raw = valid();
  expect(validateData(raw)).toEqual(valid());
});

test("DATA-03 unknown requires names the entry and field", () => {
  const raw = valid();
  raw.certifications[3].requires = "CTAL-X";
  expect(messageOf(raw)).toBe('data.json: certifications[3] (CTAL-TM).requires: "CTAL-X" is not a certification name');
});

test("DATA-03 missing field names the entry and field", () => {
  const raw = valid() as { projects: Record<string, unknown>[] };
  delete raw.projects[0].url;
  expect(messageOf(raw)).toBe("data.json: projects[0] (garden).url: is missing");
});

test("DATA-03 wrongly typed field names the entry and field", () => {
  const raw = valid() as unknown as { suite: unknown[] };
  raw.suite[1] = 7;
  expect(messageOf(raw)).toBe("data.json: suite[1]: must be a string");
});

test("DATA-03 second certification without requires is rejected", () => {
  const raw = valid() as { certifications: Record<string, unknown>[] };
  delete raw.certifications[2].requires;
  expect(messageOf(raw)).toBe(
    "data.json: certifications[2] (CT-TAS).requires: is missing; only one certification may have no requires (CTFL)",
  );
});

test("DATA-03 requires cycle is rejected", () => {
  const raw = valid();
  raw.certifications[2].requires = "CTAL-TM";
  raw.certifications[3].requires = "CT-TAS";
  expect(messageOf(raw)).toBe("data.json: certifications[2] (CT-TAS).requires: forms a cycle");
});

test("DATA-03 highlight must be one of the roles", () => {
  const raw = valid();
  raw.profile.highlight = "manager";
  expect(messageOf(raw)).toBe('data.json: profile.highlight: "manager" is not one of profile.roles');
});

test("DATA-03 at most one active tool", () => {
  const raw = valid() as { tools: Record<string, unknown>[] };
  raw.tools[1].active = true;
  expect(messageOf(raw)).toBe("data.json: tools[1] (git).active: only one tool may be active (playwright)");
});

test("DATA-03 github entry needs a numeric id", () => {
  const raw = valid() as { social: Record<string, unknown>[] };
  raw.social[0].id = "43646296";
  expect(messageOf(raw)).toBe("data.json: social[0] (github).id: must be a number");
});

test("DATA-03 tool layer must be 1, 2 or 3", () => {
  const raw = valid() as { tools: Record<string, unknown>[] };
  raw.tools[0].layer = 4;
  expect(messageOf(raw)).toBe("data.json: tools[0] (playwright).layer: must be 1, 2 or 3");
});

test("DATA-03 empty project and gist lists are valid", () => {
  const raw = valid();
  raw.projects = [];
  raw.gists = [];
  expect(validateData(raw).projects).toEqual([]);
});
