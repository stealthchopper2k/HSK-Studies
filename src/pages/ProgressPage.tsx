import { Link } from "react-router-dom";
import { modules } from "../data/modules";
import { useProgress } from "../lib/context";
import { moduleComplete } from "../lib/progress";

export function ProgressPage() {
  const { state, reset } = useProgress();
  const done = modules.filter((m) => moduleComplete(state.modules[m.id])).length;
  const bestExam = state.examAttempts.reduce((m, a) => Math.max(m, a.total), 0);

  return (
    <main className="page">
      <p className="kicker">Your path</p>
      <h1>Progress</h1>
      <p className="lede">
        Saved in this browser only. Complete a module by finishing the lesson and scoring 70% on
        its quiz. The exam is 120/200 to pass.
      </p>
      <div className="hero-stats">
        <div>
          <b>
            {done}/{modules.length}
          </b>
          <span>modules</span>
        </div>
        <div>
          <b>{state.seen.length}</b>
          <span>words opened</span>
        </div>
        <div>
          <b>{bestExam || "—"}</b>
          <span>best exam</span>
        </div>
      </div>
      <section className="track">
        {modules.map((m) => {
          const p = state.modules[m.id];
          const ok = moduleComplete(p);
          return (
            <Link key={m.id} to={`/learn/${m.id}`} className={`track-row ${ok ? "ok" : ""}`}>
              <span className="num">{m.number}</span>
              <span>
                <strong>{m.title}</strong>
                <em>
                  {p?.lessonDone ? "Lesson done" : "Not started"}
                  {p?.quizBest ? ` · quiz ${p.quizBest}%` : ""}
                </em>
              </span>
              <span className="tag">{ok ? "Complete" : "Open"}</span>
            </Link>
          );
        })}
      </section>
      <section className="track">
        <h3>Exam attempts</h3>
        {state.examAttempts.length === 0 && <p className="muted">No exam yet.</p>}
        {state.examAttempts.map((a) => (
          <div key={a.at} className="track-row">
            <span className="num">{a.passed ? "✓" : "·"}</span>
            <span>
              <strong>
                {a.total}/200 {a.passed ? "pass" : "below 120"}
              </strong>
              <em>
                Listening {a.listening} · Reading {a.reading} · {new Date(a.at).toLocaleString()}
              </em>
            </span>
          </div>
        ))}
      </section>
      <button
        className="ghost danger"
        onClick={() => {
          if (confirm("Reset all progress on this device?")) reset();
        }}
      >
        Reset progress
      </button>
    </main>
  );
}
