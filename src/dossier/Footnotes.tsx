import type { ReactNode } from "react";
import { cls } from "./util";

export interface Footnote {
  /** Defaults to 01, 02, … */
  id?: string;
  text: ReactNode;
}

export interface FootnotesProps {
  notes: Footnote[];
  className?: string;
}

/** Port of Dossier's Footnotes: numbered notes under a short rule. */
export function Footnotes({ notes, className }: FootnotesProps) {
  return (
    <ol className={cls("ds-notes", className)}>
      {notes.map((n, i) => (
        <li key={i} className="ds-note">
          <span className="label ds-note-id">{n.id != null ? String(n.id) : (i < 9 ? "0" : "") + (i + 1)}</span>
          <span className="caption ds-note-text">{n.text}</span>
        </li>
      ))}
    </ol>
  );
}
