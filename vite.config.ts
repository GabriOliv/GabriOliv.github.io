import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { validateData } from "./src/model/validate";

/** data.json by default; build tests point DATA_PATH at a fixture. */
const dataPath = resolve(process.env.DATA_PATH ?? "data.json");

const readData = () => validateData(JSON.parse(readFileSync(dataPath, "utf8")));

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Stops dev and build on data the page cannot render (DATA-03); titles the page with profile.name. */
function validateDataPlugin(): Plugin {
  return {
    name: "validate-data",
    buildStart() {
      readData();
    },
    transformIndexHtml(html) {
      return html.replace("<title></title>", `<title>${escapeHtml(readData().profile.name)}</title>`);
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), validateDataPlugin()],
  resolve: { alias: { "@data": dataPath } },
});
