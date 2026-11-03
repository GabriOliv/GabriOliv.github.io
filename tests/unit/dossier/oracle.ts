import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

/** Dossier's original bundle.js, run in a sandbox whose `window.React` is the app's React. */
const source = readFileSync(new URL("../../fixtures/dossier-bundle.js", import.meta.url), "utf8");
const sandbox: { window: { React: typeof React; Dossier?: Record<string, React.FC<any>> } } = { window: { React } };
runInNewContext(source, sandbox);

export const original = sandbox.window.Dossier!;

/** Static markup of the original Dossier component `name` with `props`. */
export function renderOriginal(name: string, props: object): string {
  return renderToStaticMarkup(React.createElement(original[name], props));
}

/** Static markup of a ported element, for comparison with renderOriginal. */
export function render(element: React.ReactElement): string {
  return renderToStaticMarkup(element);
}
