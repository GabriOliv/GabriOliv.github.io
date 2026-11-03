import type { Cert, Entry, HierarchyNode } from "./types";

/** A project is live when its URL opens a published github.io site. */
export function isLive(url: string): boolean {
  return url.toLowerCase().includes("github.io");
}

export function shortUrl(url: string): string {
  return url.replace(/^https:\/\//, "").replace(/\/$/, "");
}

export function liveCount(projects: Entry[]): number {
  return projects.filter((p) => isLive(p.url)).length;
}

/** `length` hex digits, each drawn from `random` (0 <= r < 1). */
export function hexCode(length: number, random: () => number = Math.random): string {
  return Array.from({ length }, () => Math.floor(random() * 16).toString(16)).join("");
}

export function fileCode(file: string, rev: string): string {
  return `File ${file} · Rev ${rev}`;
}

/** A top certification is one no other certification builds on; the page shows it in signal (CERT-01, CERT-03). */
export function isTop(certs: Cert[], c: Cert): boolean {
  return !certs.some((x) => x.requires === c.name);
}

/** The certification tree by `requires`, children in data order, top ones active; null when there are none. */
export function certTree(certs: Cert[]): HierarchyNode | null {
  const node = (c: Cert): HierarchyNode => {
    const children = certs.filter((x) => x.requires === c.name).map(node);
    return { code: c.name, label: c.focus, ...(children.length ? { children } : { active: true }) };
  };
  const root = certs.find((c) => c.requires === undefined);
  return root ? node(root) : null;
}
