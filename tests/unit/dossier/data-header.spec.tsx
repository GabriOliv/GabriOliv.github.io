import { expect, test } from "@playwright/test";
import { DataHeader, type DataHeaderProps } from "../../../src/dossier/DataHeader";
import { render, renderOriginal } from "./oracle";

const cases: [string, DataHeaderProps][] = [
  [
    "band as the page uses it",
    { title: "Gabriel O. Laureano", code: "File 43646296 · Rev 0427", kicker: "Subject file", meta: "Suite 3/3 pass" },
  ],
  ["band with title only", { title: "Gabriel O. Laureano" }],
  ["band with meta and no kicker", { title: "T", meta: "M", className: "x" }],
  ["running variant", { variant: "running", title: "T", code: "C", kicker: "K", meta: "03 / 12" }],
];

for (const [name, props] of cases) {
  test(`PAGE-03 DataHeader port matches Dossier: ${name}`, () => {
    expect(render(<DataHeader {...props} />)).toBe(renderOriginal("DataHeader", props));
  });
}
