import { expect, test } from "@playwright/test";
import { Quote, type QuoteProps } from "../../../src/dossier/Quote";
import { render, renderOriginal } from "./oracle";

const roles = ["computer scientist.", "software tester.", "qa engineer.", "test strategist."].map((r, i) => (
  <span key={r} className={i === 2 ? "ds-hl" : undefined}>
    {r}
  </span>
));

const cases: [string, QuoteProps][] = [
  ["statement with kicker and four roles, one highlighted", { variant: "statement", kicker: "Role", children: roles }],
  ["statement with note", { variant: "statement", children: "Stability holds.", note: "Nine cycles." }],
  ["sourced quote with code", { children: "Quality is a habit.", source: "Field report", code: "FILE 0427" }],
  ["quote without source", { children: "Plain.", className: "x" }],
];

for (const [name, props] of cases) {
  test(`PAGE-06 Quote port matches Dossier: ${name}`, () => {
    expect(render(<Quote {...props} />)).toBe(renderOriginal("Quote", props));
  });
}
