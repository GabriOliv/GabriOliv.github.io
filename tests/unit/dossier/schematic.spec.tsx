import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { Schematic, type SchematicProps } from "../../../src/dossier/Schematic";
import { render, renderOriginal } from "./oracle";

const tools: { name: string; layer: number; angle: number; active?: boolean }[] = JSON.parse(
  readFileSync("data.json", "utf8"),
).tools;
const nodes = tools.map((t) => ({ ring: t.layer, angle: t.angle, label: t.name, active: t.active }));

const page = (size: number): SchematicProps => ({
  size,
  labelWidth: 94,
  rings: 3,
  title: "Tools by layer, from test code at the centre to infrastructure on the outer ring",
  nodes,
});

const cases: [string, SchematicProps][] = [
  ["seven tools at 120", page(120)],
  ["seven tools at 200", page(200)],
  ["seven tools at 260", page(260)],
  ["defaults, no ticks", { nodes: [{ ring: 9, angle: 0, label: "far" }], ticks: false, className: "x" }],
];

for (const [name, props] of cases) {
  test(`STACK-01 Schematic port matches Dossier: ${name}`, () => {
    expect(render(<Schematic {...props} />)).toBe(renderOriginal("Schematic", props));
  });
}
