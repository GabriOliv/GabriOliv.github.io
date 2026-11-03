/** Page sections: Certifications before Stack, then the old site's order (AD-009); the suite now runs inside the qafetch panel. */
export const SECTIONS = [
  { id: "certs", tab: "Certs", title: "Certifications" },
  { id: "stack", tab: "Stack", title: "Stack" },
  { id: "projects", tab: "Projects", title: "Projects" },
  { id: "gists", tab: "Gists", title: "Gists" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** A section's number ("01" …) from its place in SECTIONS, and its title. */
export function sectionHeading(id: SectionId): { index: string; title: string } {
  const i = SECTIONS.findIndex((s) => s.id === id);
  return { index: String(i + 1).padStart(2, "0"), title: SECTIONS[i].title };
}
