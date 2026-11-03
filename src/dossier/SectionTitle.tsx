import { cls, up } from "./util";

export interface SectionTitleProps {
  /** Section number, shown as "SECTION 02" after the signal bar. */
  index?: string | number;
  title: string;
  meta?: string;
  className?: string;
}

/** Port of Dossier's SectionTitle: signal bar and section number over an uppercase title, closed by a rule. */
export function SectionTitle({ index, title, meta, className }: SectionTitleProps) {
  return (
    <div className={cls("ds-section", className)}>
      <div className="ds-section-top">
        <span className="ds-section-bar" aria-hidden="true" />
        {index != null ? <span className="label ds-section-index">{"SECTION " + up(String(index))}</span> : null}
      </div>
      <div className="ds-section-row">
        <h2 className="title ds-section-title">{up(title)}</h2>
        {meta ? <span className="label ds-section-meta">{up(meta)}</span> : null}
      </div>
    </div>
  );
}
