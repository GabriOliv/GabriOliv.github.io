import { expect, test } from "@playwright/test";
import { StatusFlag, type StatusFlagProps } from "../../../src/dossier/StatusFlag";
import { render, renderOriginal } from "./oracle";

const cases: [string, StatusFlagProps][] = [
  ["pass", { status: "pass" }],
  ["fail", { status: "fail" }],
  ["skip", { status: "skip" }],
  ["pending", { status: "pending" }],
  ["pass with the word Active", { status: "pass", children: "Active" }],
];

for (const [name, props] of cases) {
  test(`CERT-03 StatusFlag port matches Dossier: ${name}`, () => {
    expect(render(<StatusFlag {...props} />)).toBe(renderOriginal("StatusFlag", props));
  });
}
