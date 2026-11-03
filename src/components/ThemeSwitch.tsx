import { useState } from "react";

const THEMES = ["paper", "void", "blueprint"] as const;
type Theme = (typeof THEMES)[number];

/** The theme index.html set before first paint: the visitor's pick, else the OS. */
function current(): Theme {
  const t = document.documentElement.getAttribute("data-theme");
  return (THEMES as readonly string[]).includes(t ?? "") ? (t as Theme) : "paper";
}

/** Paper / Void / Blueprint as three swatches in the tab bar; the pick is kept in localStorage when storage works
 * (THEME-01 to THEME-06). Each swatch takes its theme's tokens from its own data-theme. */
export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(current);
  function pick(id: Theme) {
    document.documentElement.setAttribute("data-theme", id);
    try {
      localStorage.setItem("dossier-ds", id);
    } catch {
      /* storage blocked: the theme still applies for this visit */
    }
    setTheme(id);
  }
  return (
    <div className="pg-themes" role="group" aria-label="Theme">
      {THEMES.map((id) => (
        <button
          key={id}
          id={"theme-" + id}
          type="button"
          aria-label={id}
          title={id}
          aria-pressed={theme === id ? "true" : "false"}
          onClick={() => pick(id)}
        >
          <span className="pg-swatch" data-theme={id} />
        </button>
      ))}
    </div>
  );
}
