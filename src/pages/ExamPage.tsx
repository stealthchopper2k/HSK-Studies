import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ListenButton } from "../components/ListenButton";
import { examMeta, examQuestions } from "../data/exam";
import { useProgress } from "../lib/context";
import { stopSpeak } from "../lib/speech";
import { modules } from "../data/modules";
import { moduleComplete } from "../lib/progress";

export function ExamPage() {
  const { recordExam, state } = useProgress();
  const ready = modules.filter((m) => moduleComplete(state.modules[m.id])).length;
  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hintOn, setHintOn] = useState(false);

  const q = examQuestions[i];
  const result = useMemo(() => {
    if (phase !== "done") return null;
    let listening = 0;
    let reading = 0;
    for (const item of examQuestions) {
      const ok = answers[item.id] === item.answer;
      if (item.section === "listening" && ok) listening += 1;
      if (item.section === "reading" && ok) reading += 1;
    }
    const listeningScore = listening * 5;
    const readingScore = reading * 5;
    const total = listeningScore + readingScore;
    return { listening, reading, listeningScore, readingScore, total, passed: total >= examMeta.pass };
  }, [answers, phase]);

  const finish = (finalAnswers: Record<string, string>) => {
    stopSpeak();
    let listening = 0;
    let reading = 0;
    for (const item of examQuestions) {
      const ok = finalAnswers[item.id] === item.answer;
      if (item.section === "listening" && ok) listening += 1;
      if (item.section === "reading" && ok) reading += 1;
    }
    const total = listening * 5 + reading * 5;
    recordExam({
      at: new Date().toISOString(),
      listening: listening * 5,
      reading: reading * 5,
      total,
      passed: total >= examMeta.pass,
    });
    setPhase("done");
  };

  const commit = (opt: string) => {
    const nextAnswers = { ...answers, [q.id]: opt };
    setAnswers(nextAnswers);
    setPicked(opt);
  };

  const goNext = () => {
    if (!picked) return;
    if (i + 1 >= examQuestions.length) {
      finish({ ...answers, [q.id]: picked });
      return;
    }
    setI((n) => n + 1);
    setPicked(null);
    setHintOn(false);
    stopSpeak();
  };

  if (phase === "intro") {
    return (
      <main className="page exam-intro">
        <p className="kicker">Final assessment</p>
        <h1>HSK 1 mock exam</h1>
        <p className="lede">
          Same shape as the official paper still used worldwide in 2026: 20 listening items (~15
          min), 20 reading items (~17 min), pinyin printed on every question. Pass mark 120 / 200.
          Audio is spoken twice by your device, like the real recording.
        </p>
        <ul className="facts">
          <li>40 questions · 5 points each</li>
          <li>No writing section on HSK 1</li>
          <li>
            You have completed {ready}/{modules.length} modules
          </li>
        </ul>
        <button
          className="primary"
          onClick={() => {
            setPhase("run");
            setI(0);
            setAnswers({});
            setPicked(null);
            setHintOn(false);
          }}
        >
          Begin exam
        </button>
        <p className="muted">You can sit it before finishing every module — scores still save.</p>
      </main>
    );
  }

  if (phase === "done" && result) {
    return (
      <main className="page">
        <p className="kicker">{result.passed ? "合格 Pass" : "Keep going"}</p>
        <h1>{result.total} / 200</h1>
        <div className="hero-stats">
          <div>
            <b>{result.listeningScore}</b>
            <span>listening / 100</span>
          </div>
          <div>
            <b>{result.readingScore}</b>
            <span>reading / 100</span>
          </div>
          <div>
            <b>{result.passed ? "Pass" : "Retry"}</b>
            <span>need 120</span>
          </div>
        </div>
        <section className="review">
          {examQuestions.map((item) => {
            const mine = answers[item.id];
            const ok = mine === item.answer;
            return (
              <article key={item.id} className={`glass review-row ${ok ? "ok" : "no"}`}>
                <p className="kicker">
                  {item.id} · {item.part}
                </p>
                <p className="zh">{item.prompt}</p>
                {item.promptPinyin && <p className="py">{item.promptPinyin}</p>}
                <p>
                  Your answer: {item.options.find((o) => o.id === mine)?.label ?? "—"} · Correct:{" "}
                  {item.options.find((o) => o.id === item.answer)?.label}
                </p>
              </article>
            );
          })}
        </section>
        <div className="row">
          <button className="primary" onClick={() => setPhase("intro")}>
            Sit again
          </button>
          <Link className="ghost" to="/">
            Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="exam-progress">
        <span>
          {q.section === "listening" ? "听力 Listening" : "阅读 Reading"} · {i + 1}/{examQuestions.length}
        </span>
        <div className="bar">
          <i style={{ width: `${((i + 1) / examQuestions.length) * 100}%` }} />
        </div>
      </div>
      <section className="quiz glass">
        <p className="kicker">{q.part}</p>
        <div className="quiz-tools">
          {q.audio && <ListenButton text={q.audio} times={2} label="Play twice 播放两遍" />}
          {!hintOn && !picked && (
            <button className="listen hint-btn" type="button" onClick={() => setHintOn(true)}>
              Hint
            </button>
          )}
        </div>
        <h2 className="zh prompt">{q.prompt}</h2>
        {q.promptPinyin && <p className="py big">{q.promptPinyin}</p>}
        {hintOn && (
          <p className="hint-box">
            {q.hint ?? "Compare the recording with the choices, then drop the one that does not fit."}
            {q.options.length > 2 && <span>One wrong choice removed.</span>}
          </p>
        )}
        <div className="options">
          {q.options.map((o) => {
            const dropped =
              hintOn &&
              !picked &&
              q.options.length > 2 &&
              o.id === q.options.find((opt) => opt.id !== q.answer)?.id;
            return (
              <button
                key={o.id}
                className={`opt ${picked === o.id ? "picked" : ""} ${dropped ? "out" : ""}`}
                disabled={Boolean(dropped)}
                onClick={() => commit(o.id)}
              >
                <strong>
                  {o.id}. {o.label}
                </strong>
                {o.pinyin && <span className="py">{o.pinyin}</span>}
              </button>
            );
          })}
        </div>
        <button className="primary" disabled={!picked} onClick={goNext}>
          {i + 1 === examQuestions.length ? "Submit exam" : "Next question"}
        </button>
      </section>
    </main>
  );
}
