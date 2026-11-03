import { STATUS, StatusFlag, type CheckResult } from "./StatusFlag";
import { cls, up } from "./util";

export interface Check {
  id?: string;
  label: string;
  result: CheckResult;
  detail?: string;
  duration?: string;
}

export interface CheckLogProps {
  title?: string;
  checks: Check[];
  className?: string;
}

const ORDER: CheckResult[] = ["pass", "fail", "skip", "pending"];

/** Port of Dossier's CheckLog: a list of checks with results and a pass/fail summary. */
export function CheckLog({ title, checks, className }: CheckLogProps) {
  const n: Record<CheckResult, number> = { pass: 0, fail: 0, skip: 0, pending: 0 };
  for (const c of checks) if (n[c.result] != null) n[c.result]++;
  const sum = ORDER.filter((k) => n[k]).flatMap((k, i) => [
    ...(i ? [<span key={"sep" + k} aria-hidden="true">{" · "}</span>] : []),
    <span key={k} className={k === "fail" ? "ds-log-sum-fail" : undefined}>
      {n[k] + " " + STATUS[k].toUpperCase()}
    </span>,
  ]);
  return (
    <div className={cls("ds-checklog", className)}>
      <div className="ds-log-head">
        <span className="heading ds-log-title">{up(title || "Checks")}</span>
        <span className="label ds-log-sum">{sum}</span>
      </div>
      <ol className="ds-log-rows">
        {checks.map((c, i) => (
          <li key={i} className={cls("ds-log-row", c.result === "fail" && "ds-log-fail")}>
            <span className="label ds-log-id">{up(c.id || "")}</span>
            <span className="body ds-log-label">{c.label}</span>
            <span className="caption ds-log-detail">{c.detail || ""}</span>
            <span className="datum ds-log-time">{c.duration || ""}</span>
            <span className="ds-log-flag">
              <StatusFlag status={c.result} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
