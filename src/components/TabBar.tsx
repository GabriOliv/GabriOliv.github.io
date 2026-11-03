import { useEffect, useRef, useState } from "react";
import { SECTIONS, type SectionId } from "../model/sections";
import { ThemeSwitch } from "./ThemeSwitch";

/** A section is current once its top is at or above this line under the bar (NAV-03). */
const CURRENT_LINE_PX = 90;

/** Sticky tabs (Home, then the sections), the current tab, the theme switch, and a reading-progress line. */
export function TabBar() {
  const [current, setCurrent] = useState<SectionId | null>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    function tick() {
      frame = 0;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY || doc.scrollTop;
      if (progress.current) progress.current.style.transform = `scaleX(${total > 0 ? Math.min(1, y / total) : 0})`;
      let active: SectionId | null = null;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= CURRENT_LINE_PX) active = s.id;
      }
      if (total > 0 && y >= total - 2) active = SECTIONS[SECTIONS.length - 1].id;
      setCurrent(active);
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    tick();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav className="pg-bar" aria-label="Sections">
      <div className="pg-wrap pg-barrow">
        <div className="pg-tabs">
          <a
            href="#"
            className="pg-cap"
            aria-current={current === null ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo(0, 0);
            }}
          >
            Home
          </a>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={"#" + s.id}
              className="pg-cap"
              aria-current={current === s.id ? "true" : undefined}
              onClick={(e) => {
                const el = document.getElementById(s.id);
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ block: "start" });
                }
              }}
            >
              {s.tab}
            </a>
          ))}
        </div>
        <ThemeSwitch />
      </div>
      <div className="pg-progress" ref={progress} aria-hidden="true" />
    </nav>
  );
}
