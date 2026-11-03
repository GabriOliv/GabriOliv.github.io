import { data } from "../data";
import { DataHeader } from "../dossier";
import { fileCode, hexCode } from "../model/derive";
import { Profile } from "./Profile";
import { StackTables } from "./StackTables";
import { TestSuite } from "./TestSuite";

/** Random hashes, drawn once per page load (PAGE-04). */
const file = hexCode(8);
const rev = hexCode(7);

/** The file's opening module: header band, then the qafetch panel (suite, profile, stack tables). */
export function SubjectFile() {
  const { profile, suite } = data;
  return (
    <div className="pg-file">
      <DataHeader
        title={profile.name}
        code={fileCode(file, rev)}
        kicker="Subject file"
        meta={`Suite ${suite.length}/${suite.length} pass`}
      />
      <div className="pg-fetch">
        <div className="pg-pane pg-pane-run" id="suite">
          <TestSuite />
        </div>
        <div className="pg-pane pg-contact">
          <Profile />
        </div>
        <div className="pg-pane pg-pane-tables">
          <StackTables />
        </div>
      </div>
    </div>
  );
}
