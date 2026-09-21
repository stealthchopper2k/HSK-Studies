import type { Word } from "../data/modules";

export type QuizItem = {
  id: string;
  kind: "meaning" | "hanzi" | "listen" | "example";
  prompt: string;
  promptPinyin?: string;
  audio?: string;
  options: { id: string; label: string; pinyin?: string }[];
  answer: string;
  hint: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distractors(words: Word[], keep: Word, n: number) {
  return shuffle(words.filter((w) => w.hanzi !== keep.hanzi)).slice(0, n);
}

export function buildQuiz(words: Word[], count = 10): QuizItem[] {
  const pool = shuffle(words);
  const items: QuizItem[] = [];
  let i = 0;
  while (items.length < Math.min(count, pool.length * 2) && i < pool.length * 4) {
    const word = pool[i % pool.length];
    const kindCycle: QuizItem["kind"][] = ["meaning", "hanzi", "listen", "example"];
    const kind = kindCycle[items.length % (word.example ? 4 : 3)];
    const others = distractors(words, word, 3);
    if (others.length < 3) {
      i += 1;
      continue;
    }
    if (kind === "meaning") {
      const opts = shuffle([word, ...others]).map((w) => ({
        id: w.hanzi,
        label: w.meaning,
      }));
      items.push({
        id: `${word.hanzi}-m-${items.length}`,
        kind,
        prompt: word.hanzi,
        promptPinyin: word.pinyin,
        options: opts,
        answer: word.hanzi,
        hint: word.example
          ? `${word.example}  ${word.examplePinyin ?? ""}`.trim()
          : `Pinyin: ${word.pinyin}`,
      });
    } else if (kind === "hanzi") {
      const opts = shuffle([word, ...others]).map((w) => ({
        id: w.hanzi,
        label: w.hanzi,
        pinyin: w.pinyin,
      }));
      items.push({
        id: `${word.hanzi}-h-${items.length}`,
        kind,
        prompt: word.meaning,
        options: opts,
        answer: word.hanzi,
        hint: `Pinyin: ${word.pinyin}`,
      });
    } else if (kind === "listen") {
      const opts = shuffle([word, ...others]).map((w) => ({
        id: w.hanzi,
        label: w.meaning,
      }));
      items.push({
        id: `${word.hanzi}-l-${items.length}`,
        kind,
        prompt: "Listen, then choose the meaning",
        audio: word.example || word.hanzi,
        options: opts,
        answer: word.hanzi,
        hint: `Pinyin: ${word.pinyin}`,
      });
    } else if (word.example && word.exampleEn) {
      const wrong = shuffle(words.filter((w) => w.exampleEn && w.hanzi !== word.hanzi)).slice(0, 3);
      if (wrong.length < 3) {
        i += 1;
        continue;
      }
      const opts = shuffle([word, ...wrong]).map((w) => ({
        id: w.hanzi,
        label: w.exampleEn || w.meaning,
      }));
      items.push({
        id: `${word.hanzi}-e-${items.length}`,
        kind: "example",
        prompt: word.example,
        promptPinyin: word.examplePinyin,
        options: opts,
        answer: word.hanzi,
        hint: `${word.hanzi} · ${word.pinyin}`,
      });
    }
    i += 1;
  }
  return items.slice(0, count);
}
