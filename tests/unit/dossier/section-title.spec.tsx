import { expect, test } from "@playwright/test";
import { SectionTitle, type SectionTitleProps } from "../../../src/dossier/SectionTitle";
import { render, renderOriginal } from "./oracle";

const cases: [string, SectionTitleProps][] = [
  ["with index and meta", { index: "02", title: "Stack", meta: "7 tools · 4 skills" }],
  ["without meta", { index: "01", title: "Profile suite" }],
  ["numeric index", { index: 3, title: "Certifications", meta: "ISTQB · 4 on record" }],
  ["without index", { title: "Gists", className: "x" }],
];

for (const [name, props] of cases) {
  test(`PAGE-16 SectionTitle port matches Dossier: ${name}`, () => {
    expect(render(<SectionTitle {...props} />)).toBe(renderOriginal("SectionTitle", props));
  });
}
