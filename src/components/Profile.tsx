import type { ReactNode } from "react";
import { data } from "../data";
import { ExtLink } from "./ExtLink";
import { RoleTyper } from "./RoleTyper";

/** A `key :: value` line of the qafetch pane. */
function Line({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="pg-kv">
      <span className="pg-k">{k}</span>
      <span className="pg-muted">::</span>
      <span className="pg-v">{children}</span>
    </div>
  );
}

/** The qafetch pane: prompt, host, profile lines, then one line per social link. */
export function Profile() {
  const { profile, social } = data;
  return (
    <>
      <div className="pg-prompt">laureano@qa:~$ qafetch</div>
      <div className="pg-host">
        <b>laureano</b>
        <span className="pg-muted">@</span>
        <b>qa</b>
      </div>
      <hr />
      <Line k="name">{profile.name}</Line>
      <Line k="role">
        <RoleTyper roles={profile.roles} highlight={profile.highlight} />
      </Line>
      <Line k="focus">{profile.focus}</Line>
      <Line k="edu">{profile.education}</Line>
      <hr />
      {social.map((s) => (
        <Line key={s.name} k={s.name}>
          <ExtLink className="pg-ext" href={s.url}>
            {s.handle}
          </ExtLink>
        </Line>
      ))}
    </>
  );
}
