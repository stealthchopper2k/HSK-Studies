import { NavLink, useLocation } from "react-router-dom";
import { modules } from "../data/modules";
import { resources, resourcesFor } from "../data/resources";

const moduleTags: Record<string, string[]> = {
  pinyin: ["pinyin"],
  greetings: ["greetings"],
  numbers: ["vocab"],
  family: ["family"],
  food: ["food"],
  school: ["school"],
  places: ["places"],
  shopping: ["vocab"],
  daily: ["vocab", "hsk3"],
  exam: ["exam", "listening"],
};

export function StudyDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const match = location.pathname.match(/\/learn\/([^/]+)/);
  const exam = location.pathname.startsWith("/exam");
  const tagKey = exam ? "exam" : match?.[1];
  const tags = tagKey ? moduleTags[tagKey] ?? ["vocab"] : ["exam", "pinyin", "vocab"];
  const focused = resourcesFor(tags);
  const rest = resources.filter((r) => !focused.includes(r));
  const current = modules.find((m) => m.id === match?.[1]);

  return (
    <>
      <div className={`scrim ${open ? "on" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open} inert={!open}>
        <header className="drawer-head">
          <div>
            <p className="kicker">Study links</p>
            <h2>Go further</h2>
            <p className="muted">
              {current
                ? `Picked for ${current.title}. Opens in a new tab — nothing is embedded here.`
                : exam
                  ? "Official papers and listening practice for the mock exam."
                  : "YouTube, official PDFs, and HSK 3.0 lists. Links only."}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <div className="drawer-body">
        {focused.length > 0 && <p className="list-label">For this page</p>}
        {focused.map((r) => (
          <a key={r.href} className="link-card" href={r.href} target="_blank" rel="noreferrer">
            <span className="link-source">{r.source}</span>
            <strong>{r.title}</strong>
            <span className="muted">{r.note}</span>
          </a>
        ))}
          <p className="list-label">Full library</p>
          {rest.map((r) => (
            <a key={r.href} className="link-card dim" href={r.href} target="_blank" rel="noreferrer">
              <span className="link-source">{r.source}</span>
              <strong>{r.title}</strong>
              <span className="muted">{r.note}</span>
            </a>
          ))}
          <NavLink className="link-card" to="/glossary" onClick={onClose}>
            <span className="link-source">In-app</span>
            <strong>HSK 3.0 Level 1 glossary</strong>
            <span className="muted">Search all 500 official Level 1 words with pinyin.</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
