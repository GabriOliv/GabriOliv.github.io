import { cls, up } from "./util";

export type CheckResult = "pass" | "fail" | "skip" | "pending";

export const STATUS: Record<CheckResult, string> = { pass: "Pass", fail: "Fail", skip: "Skipped", pending: "Pending" };

export interface StatusFlagProps {
  status: CheckResult;
  /** Overrides the word (default PASS, FAIL, SKIPPED, PENDING). */
  children?: string;
  className?: string;
}

/** Port of Dossier's StatusFlag: pass / fail / skipped / pending, with a mark and a word. */
export function StatusFlag({ status, children, className }: StatusFlagProps) {
  const st: CheckResult = STATUS[status] ? status : "pending";
  return (
    <span className={cls("label", "ds-flag", "ds-flag-" + st, className)}>
      {st === "fail" ? (
        <svg className="ds-flag-x" viewBox="0 0 8 8" width={8} height={8} aria-hidden="true">
          <path d="M1 1 L7 7 M7 1 L1 7" />
        </svg>
      ) : (
        <span className="ds-flag-dot" aria-hidden="true" />
      )}
      {up(children || STATUS[st])}
    </span>
  );
}
