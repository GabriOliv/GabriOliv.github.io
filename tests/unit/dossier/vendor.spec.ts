import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { original, renderOriginal } from "./oracle";

const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");

test("PAGE-01 Dossier files are vendored unchanged (version 1793668292-91b3)", () => {
  expect(sha256("src/dossier/tokens.css")).toBe("e455abdf427246ccacde43cc90bdb2fd3115e591fcdc0e6bd683870be68b36d8");
  expect(sha256("src/dossier/bundle.css")).toBe("97ffa2665c2c76f8a3e6a0839bd8b9ee57e236cc4ccc11668d9bd33f6731e26b");
  expect(sha256("tests/fixtures/dossier-bundle.js")).toBe(
    "9d35c7dc9e48ad3f48872fcaf2fda1039922ad45bc83902da36ab1b635c0055d",
  );
});

test("PAGE-13 vendored tokens keep Dossier's fallback font stacks", () => {
  const tokens = readFileSync("src/dossier/tokens.css", "utf8");
  expect(tokens).toContain('--font-display: "IBM Plex Sans Condensed", "Arial Narrow", sans-serif;');
  expect(tokens).toContain('--font-sans: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;');
  expect(tokens).toContain('--font-mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;');
});

test("oracle renders the original Dossier components", () => {
  expect(Object.keys(original)).toHaveLength(27);
  const html = renderOriginal("DataHeader", { title: "Gabriel O. Laureano", code: "File 1 · Rev 2" });
  expect(html).toContain('<h1 class="display ds-header-title">GABRIEL O. LAUREANO</h1>');
});
