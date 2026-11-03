import type { ReactNode } from "react";
import { cls, up } from "./util";

export interface Field {
  label: string;
  value: ReactNode;
  mono?: boolean;
  /** Value in signal; one per list. */
  active?: boolean;
}

export interface FieldListProps {
  fields: Field[];
  variant?: "record" | "definition";
  columns?: 1 | 2;
  className?: string;
}

/** Port of Dossier's FieldList: label/value record rows, or a term/description glossary. */
export function FieldList({ fields, variant, columns, className }: FieldListProps) {
  const def = variant === "definition";
  return (
    <dl className={cls("ds-fields", def && "ds-fields-def", !def && columns === 2 && "ds-fields-2", className)}>
      {fields.map((f, i) => (
        <div key={i} className="ds-field">
          {def ? (
            <dt className="body ds-field-term">{f.label}</dt>
          ) : (
            <dt className="label ds-field-label">{up(f.label)}</dt>
          )}
          <dd className={cls(f.mono ? "datum" : "body", "ds-field-value", f.active && "ds-field-on")}>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
