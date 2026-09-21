import { Link } from "react-router-dom";
import { extraWordCount, classicWordCount, modules } from "../data/modules";
import { useProgress } from "../lib/context";
import { moduleComplete } from "../lib/progress";

export function Home() {
  const { state } = useProgress();
  const done = modules.filter((m) => moduleComplete(state.modules[m.id])).length;
  const lastExam = state.examAttempts[0];

  return (
    <main className="page">
      <section className="hero">
        <p className="kicker"> modular course · official HSK 1 format</p>
        <h1>
          Learn Chinese
          <span> under falling sakura.</span>
        </h1>
        <p className="lede">
          Nine bite-size modules, pinyin on every card, quizzes as you go, and a 40-question mock
          exam that mirrors the current HSK 1 paper (listening + reading, pass 120/200). No
          handwriting — the real Level 1 test does not require it.
        </p>
        <div className="hero-stats">
          <div>
            <b>{done}/{modules.length}</b>
            <span>modules done</span>
          </div>
          <div>
            <b>{classicWordCount}</b>
            <span>exam-style words</span>
          </div>
          <div>
            <b>{extraWordCount}</b>
            <span>HSK 3.0 extras</span>
          </div>
        </div>
        {lastExam && (
          <p className="chip">
            Last exam {lastExam.total}/200 {lastExam.passed ? "· passed" : "· not yet"}
          </p>
        )}
      </section>

      <section className="module-grid">
        {modules.map((m) => {
          const p = state.modules[m.id];
          const complete = moduleComplete(p);
          return (
            <Link key={m.id} className={`mod-card ${complete ? "done" : ""}`} to={`/learn/${m.id}`}>
              <div className="mod-top">
                <span className="num">{m.number}</span>
                {complete ? <span className="tag good">Done</span> : p?.quizBest ? <span className="tag">{p.quizBest}%</span> : <span className="tag">Open</span>}
              </div>
              <h3>{m.title}</h3>
              <p>{m.subtitle}</p>
              <div className="bar">
                <i style={{ width: `${p?.lessonDone ? (p.quizBest ?? 10) : 0}%` }} />
              </div>
              <span className="count">{m.words.length} words · pinyin included</span>
            </Link>
          );
        })}
        <Link className="mod-card exam-card" to="/exam">
          <div className="mod-top">
            <span className="num">EX</span>
            <span className="tag">40 questions</span>
          </div>
          <h3>Final exam</h3>
          <p>Official HSK 1 shape: 20 listening, 20 reading, pinyin on the page, 120 to pass.</p>
          <span className="count">Sit it whenever — best after the modules</span>
        </Link>
      </section>
    </main>
  );
}
