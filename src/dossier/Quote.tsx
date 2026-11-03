import type { ReactNode } from "react";
import { cls, up } from "./util";

export interface QuoteProps {
  /** "quote" (default): attributed quote with a hanging mark. "statement": the key message, no mark. */
  variant?: "quote" | "statement";
  /** Wrap the key part in <span className="ds-hl"> to set it in signal. */
  children: ReactNode;
  kicker?: string;
  note?: string;
  source?: string;
  code?: string;
  className?: string;
}

/** Port of Dossier's Quote: an uppercase pull quote, or a statement with a kicker and a note. */
export function Quote({ variant, children, kicker, note, source, code, className }: QuoteProps) {
  const st = variant === "statement";
  return (
    <figure className={cls("ds-quote", st && "ds-statement", className)}>
      {st && kicker ? (
        <div className="label ds-statement-kicker">
          <span className="ds-quote-dash" aria-hidden="true" />
          <span>{up(kicker)}</span>
        </div>
      ) : null}
      {st ? (
        <p className="title ds-quote-text">{up(children)}</p>
      ) : (
        <blockquote className="title ds-quote-text">
          <span className="ds-quote-mark" aria-hidden="true">
            “
          </span>
          {up(children)}
        </blockquote>
      )}
      {st && note ? <p className="body ds-statement-note">{note}</p> : null}
      {source || code ? (
        <figcaption className="label ds-quote-source">
          <span className="ds-quote-dash" aria-hidden="true" />
          <span>{up(source)}</span>
          {code ? <span className="ds-quote-code">{up(code)}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
