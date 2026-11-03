import type { Data } from "./types";

type Obj = Record<string, unknown>;

function fail(path: string, problem: string): never {
  throw new Error(`data.json: ${path}: ${problem}`);
}

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function join(path: string, key: string): string {
  return path ? `${path}.${key}` : key;
}

function field(o: Obj, key: string, path: string): unknown {
  if (o[key] === undefined) fail(join(path, key), "is missing");
  return o[key];
}

function str(o: Obj, key: string, path: string): string {
  const v = field(o, key, path);
  if (typeof v !== "string") fail(join(path, key), "must be a string");
  return v;
}

function num(o: Obj, key: string, path: string): number {
  const v = field(o, key, path);
  if (typeof v !== "number") fail(join(path, key), "must be a number");
  return v;
}

function obj(o: Obj, key: string, path: string): Obj {
  const v = field(o, key, path);
  if (!isObj(v)) fail(join(path, key), "must be an object");
  return v;
}

/** Each item of `o[key]` as an object, with its path `key[i] (name)`. */
function items(o: Obj, key: string): [Obj, string][] {
  const v = field(o, key, "");
  if (!Array.isArray(v)) fail(key, "must be a list");
  return v.map((item, i) => {
    if (!isObj(item)) fail(`${key}[${i}]`, "must be an object");
    const name = typeof item.name === "string" ? ` (${item.name})` : "";
    return [item, `${key}[${i}]${name}`];
  });
}

function strings(v: unknown, path: string): void {
  if (!Array.isArray(v)) fail(path, "must be a list");
  v.forEach((s, i) => {
    if (typeof s !== "string") fail(`${path}[${i}]`, "must be a string");
  });
}

function entries(root: Obj, key: string): void {
  for (const [e, path] of items(root, key)) {
    for (const k of ["name", "url", "description", "language"]) str(e, k, path);
  }
}

function certifications(root: Obj): void {
  const certs = items(root, "certifications");
  for (const [c, path] of certs) {
    for (const k of ["name", "issuer", "type", "level", "focus"]) str(c, k, path);
    if (c.requires !== undefined) str(c, "requires", path);
  }
  const byName = new Map(certs.map(([c]) => [c.name as string, c]));
  let first: string | undefined;
  for (const [c, path] of certs) {
    if (c.requires === undefined) {
      if (first !== undefined)
        fail(`${path}.requires`, `is missing; only one certification may have no requires (${first})`);
      first = c.name as string;
    } else if (!byName.has(c.requires as string)) {
      fail(`${path}.requires`, `"${c.requires}" is not a certification name`);
    }
  }
  for (const [c, path] of certs) {
    const seen = new Set<unknown>();
    for (let at: Obj | undefined = c; at?.requires !== undefined; at = byName.get(at.requires as string)) {
      if (seen.has(at)) fail(`${path}.requires`, "forms a cycle");
      seen.add(at);
    }
  }
}

/** Checks `raw` against the shape the page needs; throws `data.json: <path>: <problem>` on the first fault. */
export function validateData(raw: unknown): Data {
  if (!isObj(raw)) throw new Error("data.json: must be an object");

  const profile = obj(raw, "profile", "");
  for (const k of ["name", "highlight", "focus", "education"]) str(profile, k, "profile");
  strings(field(profile, "roles", "profile"), "profile.roles");
  if (!(profile.roles as string[]).includes(profile.highlight as string)) {
    fail("profile.highlight", `"${profile.highlight}" is not one of profile.roles`);
  }

  let github = false;
  for (const [s, path] of items(raw, "social")) {
    for (const k of ["name", "handle", "url"]) str(s, k, path);
    if (s.name === "github") {
      num(s, "id", path);
      github = true;
    } else if (s.id !== undefined) num(s, "id", path);
  }
  if (!github) fail("social", 'no entry named "github"');

  strings(field(raw, "suite", ""), "suite");

  let active: string | undefined;
  for (const [t, path] of items(raw, "tools")) {
    for (const k of ["name", "category", "label"]) str(t, k, path);
    if (![1, 2, 3].includes(field(t, "layer", path) as number)) fail(`${path}.layer`, "must be 1, 2 or 3");
    num(t, "angle", path);
    if (t.active !== undefined && typeof t.active !== "boolean") fail(`${path}.active`, "must be true or false");
    if (t.active) {
      if (active !== undefined) fail(`${path}.active`, `only one tool may be active (${active})`);
      active = t.name as string;
    }
  }

  const skills = obj(raw, "skills", "");
  for (const [k, v] of Object.entries(skills)) if (typeof v !== "string") fail(`skills.${k}`, "must be a string");

  certifications(raw);
  entries(raw, "projects");
  entries(raw, "gists");

  return raw as unknown as Data;
}
