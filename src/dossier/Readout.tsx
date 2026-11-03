import type { ReactNode } from "react";
import { cls, up } from "./util";

type Trend = "up" | "down" | "flat";

export interface ReadoutProps {
  label: string;
  /** The figure. Numerals only. */
  value: ReactNode;
  unit?: string;
  note?: string;
  /** "signal" for the one readout that matters most on the page. */
  tone?: "ink" | "signal";
  size?: "default" | "hero";
  trend?: Trend;
  delta?: string;
  className?: string;
}

const TRI: Record<Trend, string> = { up: "5,1 9,9 1,9", down: "1,1 9,1 5,9", flat: "1,1 9,5 1,9" };

function TrendMark({ dir }: { dir: Trend }) {
  return (
    <svg
      className="ds-trend-mark"
      viewBox="0 0 10 10"
      width={10}
      height={10}
      role="img"
      aria-label={dir === "flat" ? "no change" : dir}
    >
      <polygon points={TRI[dir]} />
    </svg>
  );
}

/** Port of Dossier's Readout: one labelled figure, optionally hero-sized, with an optional trend. */
export function Readout({ label, value, unit, note, tone, size, trend, delta, className }: ReadoutProps) {
  const hero = size === "hero";
  const dir = trend && TRI[trend] ? trend : null;
  return (
    <div className={cls("ds-readout", "ds-readout-" + (tone === "signal" ? "signal" : "ink"), hero && "ds-readout-hero", className)}>
      <div className="label ds-readout-label">{up(label)}</div>
      <div className="ds-readout-value">
        <span className={cls(hero ? "figure-xl" : "figure", "ds-readout-figure")}>{value}</span>
        {unit ? <span className="label ds-readout-unit">{unit}</span> : null}
      </div>
      {dir || delta ? (
        <div className="datum ds-readout-trend">
          {dir ? <TrendMark dir={dir} /> : null}
          {delta ? <span>{delta}</span> : null}
        </div>
      ) : null}
      {note ? <div className="caption ds-readout-note">{note}</div> : null}
    </div>
  );
}
