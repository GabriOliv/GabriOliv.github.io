import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** A temp copy of data.json after `change`, for builds against altered data. */
export function dataFixture(change: (data: any) => void): string {
  const data = JSON.parse(readFileSync("data.json", "utf8"));
  change(data);
  const file = join(mkdtempSync(join(tmpdir(), "data-")), "data.json");
  writeFileSync(file, JSON.stringify(data));
  return file;
}

/** `vite build` with DATA_PATH set to `dataPath`, into a fresh temp outDir. */
export function buildWith(dataPath: string) {
  const outDir = mkdtempSync(join(tmpdir(), "dist-"));
  const run = spawnSync("npx", ["vite", "build", "--outDir", outDir, "--emptyOutDir"], {
    env: { ...process.env, DATA_PATH: dataPath },
    encoding: "utf8",
  });
  return { outDir, status: run.status, output: run.stdout + run.stderr };
}

/** Serves a built outDir with `vite preview` on `port`; call stop() when done. */
export async function previewOn(outDir: string, port: number): Promise<{ url: string; stop: () => void }> {
  const proc = spawn(
    "node",
    [
      "node_modules/vite/bin/vite.js",
      "preview",
      "--outDir",
      outDir,
      "--port",
      String(port),
      "--strictPort",
      "--host",
      "127.0.0.1",
    ],
    { stdio: "ignore" },
  );
  const url = `http://127.0.0.1:${port}/`;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(url)).ok) return { url, stop: () => proc.kill() };
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  proc.kill();
  throw new Error(`vite preview did not start on ${port}`);
}
