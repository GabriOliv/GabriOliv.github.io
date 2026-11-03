import { data } from "../data";
import { SectionTitle, Tag } from "../dossier";
import { isLive, liveCount, shortUrl } from "../model/derive";
import { sectionHeading } from "../model/sections";
import { ExtLink, Pointer } from "./ExtLink";

/** Projects in data.json order; each opens its site (LIVE) or repository (SOURCE) in a new tab. */
export function Projects() {
  const projects = data.projects;
  const { index, title } = sectionHeading("projects");
  return (
    <section id="projects" className="pg-block">
      <SectionTitle index={index} title={title} meta={`${projects.length} entries · ${liveCount(projects)} live`} />
      {projects.length ? (
        <ul className="pg-entries">
          {projects.map((p) => (
            <li key={p.name}>
              <ExtLink className="pg-entry" href={p.url}>
                <div className="pg-entry-head">
                  <h3 className="pg-entry-name">{p.name}</h3>
                  <Pointer />
                </div>
                <p className="pg-entry-desc">{p.description}</p>
                <div className="pg-chips">
                  {isLive(p.url) ? <Tag variant="solid">Live</Tag> : <Tag>Source</Tag>}
                  <Tag>{p.language}</Tag>
                </div>
                <span className="pg-entry-url">{shortUrl(p.url)}</span>
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
