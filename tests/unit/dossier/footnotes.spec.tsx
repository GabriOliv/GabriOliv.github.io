import { expect, test } from "@playwright/test";
import { Footnotes, type FootnotesProps } from "../../../src/dossier/Footnotes";
import { render, renderOriginal } from "./oracle";

const cases: [string, FootnotesProps][] = [
  [
    "two notes without ids",
    {
      notes: [
        { text: "File number is the GitHub account ID." },
        { text: "Live means the entry opens a published site. Source means it opens the repository." },
      ],
    },
  ],
  ["ten notes, ids past 09", { notes: Array.from({ length: 10 }, (_, i) => ({ text: `n${i}` })) }],
  ["explicit id", { notes: [{ id: "A", text: "x" }], className: "x" }],
];

for (const [name, props] of cases) {
  test(`PAGE-09 Footnotes port matches Dossier: ${name}`, () => {
    expect(render(<Footnotes {...props} />)).toBe(renderOriginal("Footnotes", props));
  });
}
