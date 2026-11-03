import type { ReactNode } from "react";

/** Dossier's triangle pointer, as the artifact draws it after outward links. */
export function Pointer() {
  return (
    <svg viewBox="0 0 10 10" width={10} height={10} aria-hidden="true">
      <polygon points="1,1 9,5 1,9" />
    </svg>
  );
}

/** A link that opens in a new tab (PAGE-14). */
export function ExtLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
