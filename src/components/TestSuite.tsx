import { useEffect, useState } from "react";
import { data } from "../data";

/** Each check runs this long (SUITE-02). */
export const STEP_MS = 700;
/** Clock and spinner tick. */
const TICK_MS = 70;
const FRAMES = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** The test suite: one meter segment and one row per `suite` entry, run once on open and again on request. */
export function TestSuite() {
  const n = data.suite.length;
  const total = n * STEP_MS;
  const [reduce] = useState(reducedMotion);
  const [elapsed, setElapsed] = useState(reduce ? total : 0);
  const [run, setRun] = useState(reduce ? 0 : 1);

  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    setElapsed(0);
    const timer = setInterval(() => {
      const ms = Math.min(performance.now() - start, total);
      setElapsed(ms);
      if (ms >= total) clearInterval(timer);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [run, total]);

  if (!n) return <p className="pg-note">None on record.</p>;

  const done = Math.min(n, Math.floor(elapsed / STEP_MS));
  const running = done < n;
  const frame = FRAMES[Math.floor(elapsed / TICK_MS) % FRAMES.length];

  return (
    <div className="pg-suite">
      <div className="pg-suite-head pg-cap">
        <span>Test suite</span>
        <b>{`${done}/${n} · ${(elapsed / 1000).toFixed(2)}s`}</b>
      </div>
      <div className="pg-meter" aria-hidden="true">
        {data.suite.map((s, i) => (
          <span key={s + i}>
            <i style={{ transform: `scaleX(${Math.min(1, Math.max(0, elapsed / STEP_MS - i))})` }} />
          </span>
        ))}
      </div>
      <ul className="pg-checks">
        {data.suite.map((s, i) => {
          const state = i < done ? "pass" : i === done ? "run" : "wait";
          return (
            <li key={s + i} className={"pg-check-" + state}>
              <span aria-hidden="true">{state === "pass" ? "✓" : state === "run" ? frame : "·"}</span>
              <span className="pg-check-name">{s}</span>
              <span className="pg-check-state pg-cap">{state}</span>
            </li>
          );
        })}
      </ul>
      <div className="pg-suite-foot">
        <span className="pg-note" role="status">
          {running ? "Suite running." : `${n} passed · 0 failed`}
        </span>
        <button
          id="suite-run"
          type="button"
          className="pg-btn pg-cap"
          disabled={running}
          onClick={() => !reduce && setRun(run + 1)}
        >
          Run again
        </button>
      </div>
    </div>
  );
}
