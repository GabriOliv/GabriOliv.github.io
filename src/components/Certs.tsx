import { data } from "../data";
import { Hierarchy, SectionTitle } from "../dossier";
import { certTree } from "../model/derive";
import { sectionHeading } from "../model/sections";

/** The credential tree by `requires`, left to right, top certifications in signal (no caption, AD-008). */
export function Certs() {
  const certs = data.certifications;
  const issuers = [...new Set(certs.map((c) => c.issuer))].join(", ");
  const { index, title } = sectionHeading("certs");
  return (
    <section id="certs" className="pg-block">
      <SectionTitle
        index={index}
        title={title}
        meta={certs.length ? `${issuers} · ${certs.length} on record` : "0 on record"}
      />
      {certs.length ? (
        <div className="pg-treewrap">
          <Hierarchy
            className="pg-side"
            title={`${issuers.toUpperCase()} credential structure`}
            root={certTree(certs)}
          />
        </div>
      ) : (
        <p className="pg-note">None on record.</p>
      )}
    </section>
  );
}
