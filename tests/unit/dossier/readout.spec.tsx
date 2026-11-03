import { expect, test } from "@playwright/test";
import { Readout, type ReadoutProps } from "../../../src/dossier/Readout";
import { render, renderOriginal } from "./oracle";

const cases: [string, ReadoutProps][] = [
  ["signal tone with note", { label: "Certifications", value: 4, tone: "signal", note: "istqb" }],
  ["ink tone with note", { label: "Projects", value: 6, note: "4 live sites" }],
  [
    "hero with unit, trend and delta",
    { label: "Pass rate", value: "98.6", unit: "%", size: "hero", trend: "up", delta: "+12% vs Q2" },
  ],
  ["flat trend without delta", { label: "L", value: 1, trend: "flat" }],
  ["delta without trend", { label: "L", value: 1, delta: "+1", className: "x" }],
];

for (const [name, props] of cases) {
  test(`PAGE-08 Readout port matches Dossier: ${name}`, () => {
    expect(render(<Readout {...props} />)).toBe(renderOriginal("Readout", props));
  });
}
