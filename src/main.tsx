import { createRoot } from "react-dom/client";
import "./dossier/tokens.css";
import "./dossier/bundle.css";
import "./styles/page.css";
import { App } from "./App";

declare global {
  interface Window {
    /** Set after the app's first commit; the inline load watcher in index.html stops reporting after it. */
    __pgMounted?: boolean;
  }
}

createRoot(document.getElementById("pg-app")!).render(<App />);
