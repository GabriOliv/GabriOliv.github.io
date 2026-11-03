import { expect, test } from "@playwright/test";
import { Hierarchy, type HierarchyProps } from "../../../src/dossier/Hierarchy";
import { render, renderOriginal } from "./oracle";

const cases: [string, HierarchyProps][] = [
  [
    "CTFL, CTAL, then CT-TAS and CTAL-TM",
    {
      title: "ISTQB credential structure",
      root: {
        code: "CTFL",
        label: "Foundation",
        children: [
          {
            code: "CTAL",
            label: "Advanced",
            children: [
              { code: "CT-TAS", label: "Test Automation Strategy" },
              { code: "CTAL-TM", label: "Test Management" },
            ],
          },
        ],
      },
    },
  ],
  ["single root", { root: { code: "CTFL", label: "Foundation" } }],
  [
    "active node without code",
    { root: { label: "Root", children: [{ label: "Leaf", active: true }] }, className: "x" },
  ],
];

for (const [name, props] of cases) {
  test(`CERT-01 Hierarchy port matches Dossier: ${name}`, () => {
    expect(render(<Hierarchy {...props} />)).toBe(renderOriginal("Hierarchy", props));
  });
}

test("CERT-01 Hierarchy renders nothing without a root, as Dossier", () => {
  expect(render(<Hierarchy root={null} />)).toBe(renderOriginal("Hierarchy", {}));
  expect(render(<Hierarchy root={null} />)).toBe("");
});
