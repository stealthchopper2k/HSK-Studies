import { useMemo, useState } from "react";
import glossary from "../data/hsk30-level1.json";
import { withFixedPinyin, type GlossaryWord } from "../data/pinyinFixes";
import { speak } from "../lib/speech";

const words = (glossary as GlossaryWord[]).map(withFixedPinyin);

export function GlossaryPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return words;
    return words.filter(
      (w) =>
        w.hanzi.includes(s) ||
        w.pinyin.toLowerCase().includes(s) ||
        w.meaning.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <main className="page">
      <p className="kicker">HSK 3.0 · Level 1</p>
      <h1>500-word glossary</h1>
      <p className="lede">
        Full 2021 国际中文教育中文水平等级标准 Level 1 list. The current HSK 1 exam still tests
        the older 150-word syllabus — modules teach that first, with 3.0 extras tagged.
      </p>
      <input
        className="search"
        placeholder="Search hanzi, pinyin, or English"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <p className="muted">{filtered.length} words</p>
      <section className="word-grid dense">
        {filtered.map((w) => (
          <button key={w.hanzi} className="word-card" type="button" onClick={() => speak(w.hanzi)}>
            <span className="zh">{w.hanzi}</span>
            <span className="py">{w.pinyin}</span>
            <span className="en">{w.meaning}</span>
          </button>
        ))}
      </section>
    </main>
  );
}
