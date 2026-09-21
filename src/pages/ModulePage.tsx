import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getModule } from "../data/modules";
import { useProgress } from "../lib/context";
import { ListenButton } from "../components/ListenButton";
import { buildQuiz, type QuizItem } from "../lib/quiz";
import { speak } from "../lib/speech";

export function ModulePage() {
  const { id = "" } = useParams();
  const mod = getModule(id);
  const { markLesson, recordQuiz, markSeen, module } = useProgress();
  const [tab, setTab] = useState<"learn" | "quiz">("learn");
  const [quiz, setQuiz] = useState<QuizItem[] | null>(null);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [hintOn, setHintOn] = useState(false);
  const progress = module(id);

  const startQuiz = () => {
    if (!mod) return;
    markLesson(id);
    markSeen(mod.words.map((w) => w.hanzi));
    setQuiz(buildQuiz(mod.words, 10));
    setQi(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setHintOn(false);
    setTab("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const current = quiz?.[qi];

  const choose = (optId: string) => {
    if (!quiz || !current || picked) return;
    setPicked(optId);
    if (optId === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (!quiz) return;
    if (qi + 1 >= quiz.length) {
      recordQuiz(id, Math.round((score / quiz.length) * 100));
      setDone(true);
      return;
    }
    setQi((n) => n + 1);
    setPicked(null);
    setHintOn(false);
  };

  const finalPct = quiz ? Math.round((score / quiz.length) * 100) : 0;

  if (!mod) {
    return (
      <main className="page">
        <p>Module not found.</p>
        <Link to="/">Back</Link>
      </main>
    );
  }

  return (
    <main className="page module-page">
      <Link className="back" to="/">
        ← All modules
      </Link>
      <header className="mod-hero">
        <p className="kicker">Module {mod.number}</p>
        <h1>{mod.title}</h1>
        <p className="lede">{mod.blurb}</p>
        <div className="tabs">
          <button className={tab === "learn" ? "on" : ""} onClick={() => setTab("learn")}>
            Learn
          </button>
          <button className={tab === "quiz" ? "on" : ""} onClick={() => (quiz ? setTab("quiz") : startQuiz())}>
            Quiz
          </button>
        </div>
        {progress?.quizBest ? <p className="chip">Best quiz {progress.quizBest}%</p> : null}
      </header>

      {tab === "learn" && (
        <>
          <section className="grammar">
            {mod.grammar.map((g) => (
              <article key={g.title} className="glass">
                <p className="kicker">{g.pattern}</p>
                <h3>{g.title}</h3>
                <p>{g.detail}</p>
                <button className="example" onClick={() => speak(g.example)} type="button">
                  <span className="zh">{g.example}</span>
                  <span className="py">{g.examplePinyin}</span>
                  <span className="en">{g.exampleEn}</span>
                </button>
              </article>
            ))}
          </section>
          <section className="word-grid">
            {mod.words.map((w) => (
              <button
                key={w.hanzi + w.pinyin}
                className="word-card"
                type="button"
                onClick={() => speak(w.hanzi)}
              >
                {w.extra && <span className="tag extra">3.0</span>}
                <span className="zh">{w.hanzi}</span>
                <span className="py">{w.pinyin}</span>
                <span className="en">{w.meaning}</span>
                {w.example && (
                  <span className="mini">
                    {w.example}
                    <em>{w.examplePinyin}</em>
                  </span>
                )}
              </button>
            ))}
          </section>
          <div className="sticky-cta">
            <button className="primary" onClick={startQuiz}>
              Start 10-question quiz
            </button>
          </div>
        </>
      )}

      {tab === "quiz" && quiz && current && !done && (
        <section className="quiz glass">
          <p className="kicker">
            {qi + 1} / {quiz.length} · {current.kind}
          </p>
          <div className="quiz-tools">
            {current.audio && <ListenButton text={current.audio} times={2} label="Play twice" />}
            {!hintOn && !picked && (
              <button className="listen hint-btn" type="button" onClick={() => setHintOn(true)}>
                Hint
              </button>
            )}
          </div>
          <h2 className="zh prompt">{current.prompt}</h2>
          {current.promptPinyin && current.kind !== "listen" && <p className="py big">{current.promptPinyin}</p>}
          {hintOn && (
            <p className="hint-box">
              {current.hint}
              <span>One wrong choice removed.</span>
            </p>
          )}
          <div className="options">
            {current.options.map((o) => {
              const show = Boolean(picked);
              const good = o.id === current.answer;
              const mine = o.id === picked;
              const dropped =
                hintOn && !picked && o.id === current.options.find((opt) => opt.id !== current.answer)?.id;
              return (
                <button
                  key={o.id}
                  className={`opt ${show && good ? "good" : ""} ${show && mine && !good ? "bad" : ""} ${dropped ? "out" : ""}`}
                  disabled={Boolean(picked) || Boolean(dropped)}
                  onClick={() => choose(o.id)}
                >
                  <strong>{o.label}</strong>
                  {o.pinyin && <span className="py">{o.pinyin}</span>}
                </button>
              );
            })}
          </div>
          {picked && (
            <button className="primary" onClick={next}>
              {qi + 1 === quiz.length ? "See score" : "Next"}
            </button>
          )}
        </section>
      )}

      {tab === "quiz" && done && quiz && (
        <section className="quiz glass result">
          <p className="kicker">Quiz complete</p>
          <h2>{finalPct}%</h2>
          <p>
            {score}/{quiz.length} correct. {finalPct >= 70 ? "Module marked complete." : "Need 70% to complete — try again."}
          </p>
          <div className="row">
            <button className="primary" onClick={startQuiz}>
              Retry
            </button>
            <Link className="ghost" to="/">
              Back to modules
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
