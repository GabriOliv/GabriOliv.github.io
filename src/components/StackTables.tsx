import { data } from "../data";
import { isTop } from "../model/derive";

/** A small two-column table; `on` rows get the signal tint. Empty rows show "None on record.". */
function MiniTable({ id, head, rows }: { id: string; head: [string, string]; rows: [string, string, boolean?][] }) {
  return (
    <div className="pg-mini-wrap" id={id}>
      <h3 className="pg-mini-cap pg-cap">{id.replace("pg-t-", "")}</h3>
      {rows.length ? (
        <table className="pg-mini">
          <thead>
            <tr>
              <th scope="col">{head[0]}</th>
              <th scope="col">{head[1]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, v, on]) => (
              <tr key={k} className={on ? "pg-on" : undefined}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="pg-note">None on record.</p>
      )}
    </div>
  );
}

/** The `stack --list` pane: tools, certifications and skills tables. */
export function StackTables() {
  const { tools, skills, certifications: certs } = data;
  return (
    <>
      <div className="pg-prompt">laureano@qa:~$ stack --list</div>
      <MiniTable id="pg-t-tools" head={["name", "use"]} rows={tools.map((t) => [t.name, t.label, t.active])} />
      <MiniTable
        id="pg-t-certifications"
        head={["code", "focus"]}
        rows={certs.map((c) => [c.name, c.focus, isTop(certs, c)])}
      />
      <MiniTable id="pg-t-skills" head={["skill", "level"]} rows={Object.entries(skills)} />
    </>
  );
}
