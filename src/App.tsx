import { useEffect, type ComponentType } from "react";
import { Certs } from "./components/Certs";
import { EndOfFile } from "./components/EndOfFile";
import { Gists } from "./components/Gists";
import { Projects } from "./components/Projects";
import { Stack } from "./components/Stack";
import { SubjectFile } from "./components/SubjectFile";
import { TabBar } from "./components/TabBar";
import { SECTIONS, type SectionId } from "./model/sections";

/** One component per section; the order, numbers and tabs all come from SECTIONS. */
const SECTION_VIEWS: Record<SectionId, ComponentType> = {
  stack: Stack,
  certs: Certs,
  projects: Projects,
  gists: Gists,
};

/** The subject file: tab bar (with the theme switch), the qafetch panel, then sections in the old site's order. */
export function App() {
  // Only a committed render counts as mounted, so a render error still reaches the load watcher (PAGE-11).
  useEffect(() => {
    window.__pgMounted = true;
  }, []);

  return (
    <>
      <TabBar />
      <main className="pg-wrap pg-main">
        <SubjectFile />
        {SECTIONS.map(({ id }) => {
          const View = SECTION_VIEWS[id];
          return <View key={id} />;
        })}
        <EndOfFile />
      </main>
    </>
  );
}
