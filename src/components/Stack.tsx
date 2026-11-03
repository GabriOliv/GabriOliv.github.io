import { useEffect, useRef, useState } from "react";
import { data } from "../data";
import { Schematic, SectionTitle } from "../dossier";
import { sectionHeading } from "../model/sections";

const LABEL_WIDTH = 94;

/** Outer ring diameter that fits the column: 120 to 260 px (STACK-06). */
const ringSize = (column: number) => Math.max(120, Math.min(260, column - 2 * LABEL_WIDTH));

/** Tools on the Schematic by layer; the tool and skill tables sit in the qafetch panel. */
export function Stack() {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(() => Math.min(window.innerWidth - 32, 728));
  useEffect(() => {
    const measure = () => box.current && setWidth(box.current.clientWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { tools } = data;
  const { index, title } = sectionHeading("stack");

  return (
    <section id="stack" className="pg-block">
      <SectionTitle index={index} title={title} meta={`${tools.length} tools`} />
      {tools.length ? (
        <figure className="pg-fig">
          <div className="pg-fig-box" ref={box}>
            <Schematic
              size={ringSize(width)}
              labelWidth={LABEL_WIDTH}
              rings={3}
              title="Tools by layer, from test code at the centre to infrastructure on the outer ring"
              nodes={tools.map((t) => ({ ring: t.layer, angle: t.angle, label: t.name, active: t.active }))}
            />
          </div>
          <figcaption className="pg-note">
            Fig. 1. Tools by layer. Inner ring: test code. Middle ring: delivery. Outer ring: infrastructure.
          </figcaption>
        </figure>
      ) : (
        <p className="pg-note">None on record.</p>
      )}
    </section>
  );
}
