import { useEffect, useState } from "react";

const TYPE_MS = 90;
const ERASE_MS = 45;
/** How long a fully typed role stays (PAGE-06). */
export const HOLD_MS = 1600;

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** One line that types each role, holds it, erases it and moves on; the highlight role shows in signal. */
export function RoleTyper({ roles, highlight }: { roles: string[]; highlight: string }) {
  const [reduce] = useState(reducedMotion);
  const [shown, setShown] = useState({
    word: reduce ? highlight : (roles[0] ?? ""),
    chars: reduce ? highlight.length : 0,
  });

  useEffect(() => {
    if (reduce || !roles.length) return;
    let wi = 0;
    let ci = 0;
    let erasing = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = roles[wi];
      ci += erasing ? -1 : 1;
      setShown({ word, chars: ci });
      if (!erasing && ci === word.length) {
        erasing = true;
        timer = setTimeout(tick, HOLD_MS);
        return;
      }
      if (erasing && ci === 0) {
        erasing = false;
        wi = (wi + 1) % roles.length;
      }
      timer = setTimeout(tick, erasing ? ERASE_MS : TYPE_MS);
    };
    timer = setTimeout(tick, TYPE_MS);
    return () => clearTimeout(timer);
  }, [reduce, roles]);

  return (
    <>
      <span className="pg-sr">{roles.join(", ")}</span>
      <span className="pg-typer" aria-hidden="true">
        <span className={shown.word === highlight ? "pg-hl" : undefined}>{shown.word.slice(0, shown.chars)}</span>
        <span className="pg-caret" />
      </span>
    </>
  );
}
