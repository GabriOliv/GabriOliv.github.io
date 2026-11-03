import { expect, test } from "@playwright/test";
import { Tag, type TagProps } from "../../../src/dossier/Tag";
import { render, renderOriginal } from "./oracle";

const cases: [string, TagProps][] = [
  ["outline by default", { children: "TypeScript" }],
  ["solid", { variant: "solid", children: "Live" }],
  ["inverse", { variant: "inverse", children: "Archived", className: "x" }],
];

for (const [name, props] of cases) {
  test(`PROJ-02 Tag port matches Dossier: ${name}`, () => {
    expect(render(<Tag {...props} />)).toBe(renderOriginal("Tag", props));
  });
}
