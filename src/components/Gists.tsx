import { data } from "../data";
import { SectionTitle, Tag } from "../dossier";
import { sectionHeading } from "../model/sections";
import { ExtLink } from "./ExtLink";

/** Gists in data.json order; each opens in a new tab. */
export function Gists() {
  const gists = data.gists;
  const { index, title } = sectionHeading("gists");
  return (
    <section id="gists" className="pg-block">
      <SectionTitle index={index} title={title} meta={`${gists.length} entries`} />
      {gists.length ? (
        <ul className="pg-entries">
          {gists.map((g) => (
            <li key={g.name}>
              <ExtLink className="pg-gist" href={g.url}>
                <span className="pg-gist-name">{g.name}</span>
                <Tag>{g.language}</Tag>
                <span className="pg-gist-desc">{g.description}</span>
              </ExtLink>
            </li>
          ))}
        </ul>
      ) : (
        <p className="pg-note">None on record.</p>
      )}
    </section>
  );
}
