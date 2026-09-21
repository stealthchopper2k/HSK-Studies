import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { SakuraPetals } from "./SakuraPetals";
import { StudyDrawer } from "./StudyDrawer";
import { useProgress } from "../lib/context";
import { modules } from "../data/modules";
import { moduleComplete } from "../lib/progress";

export function Layout() {
  const [studyOpen, setStudyOpen] = useState(false);
  const { state } = useProgress();
  const done = modules.filter((m) => moduleComplete(state.modules[m.id])).length;
  const pct = Math.round((done / modules.length) * 100);

  return (
    <>
      <SakuraPetals />
      <div className="app-shell">
        <header className="topbar">
          <NavLink to="/" className="brand">
            <span className="bloom">桜</span>
            <span>
              <strong>HSK Studies</strong>
              <em>Level 1 · 一级</em>
            </span>
          </NavLink>
          <nav className="nav">
            <NavLink to="/" end>
              Learn
            </NavLink>
            <NavLink to="/glossary">Glossary</NavLink>
            <NavLink to="/progress">Progress</NavLink>
            <NavLink to="/exam" className="exam-link">
              Exam
            </NavLink>
          </nav>
          <div className="top-actions">
            <div className="mini-progress" title={`${done}/${modules.length} modules`}>
              <i style={{ width: `${pct}%` }} />
            </div>
            <button className="ghost" onClick={() => setStudyOpen(true)}>
              Study links
            </button>
          </div>
        </header>
        <Outlet />
      </div>
      <StudyDrawer open={studyOpen} onClose={() => setStudyOpen(false)} />
    </>
  );
}
