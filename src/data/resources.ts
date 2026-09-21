export type Resource = {
  title: string;
  href: string;
  source: string;
  note: string;
  tags: string[];
};

export const resources: Resource[] = [
  {
    title: "Official HSK Level 1 overview",
    href: "https://www.chinesetest.cn/HSK/1",
    source: "Chinese Testing International",
    note: "Current exam: 40 items, listening + reading, ~40 minutes, pass 120/200.",
    tags: ["exam", "official"],
  },
  {
    title: "HSK 1 sample paper (PDF)",
    href: "https://www.chinesetest.cn/userfiles/file/HSK1.pdf",
    source: "Hanban / CTI",
    note: "Official sample with pinyin on every item.",
    tags: ["exam", "official"],
  },
  {
    title: "That's Mandarin HSK 1 practice test",
    href: "https://www.thatsmandarin.com/hsk-level-1-downloadable-hsk-practice-test/",
    source: "That's Mandarin",
    note: "Downloadable PDF + MP3 listening file.",
    tags: ["exam", "listening"],
  },
  {
    title: "HSK 3.0 Level 1 word list (500 words)",
    href: "https://github.com/krmanik/HSK-3.0",
    source: "krmanik / HSK-3.0",
    note: "2021 grading standard vocabulary, characters, and grammar lists.",
    tags: ["vocab", "hsk3"],
  },
  {
    title: "HSK 1 — 150 words & sentence examples",
    href: "https://www.youtube.com/watch?v=mfBwNIjMbss",
    source: "Mandarin Corner",
    note: "Full classic HSK 1 vocabulary with example sentences (~98 min).",
    tags: ["vocab", "greetings", "school"],
  },
  {
    title: "HSK 1 nouns 1–30",
    href: "https://www.youtube.com/watch?v=hHPCtKsNIes",
    source: "Mandarin Corner",
    note: "First chunk of the classic 150, with pinyin on screen.",
    tags: ["vocab", "family", "food"],
  },
  {
    title: "Mandarin Corner HSK 1 playlist",
    href: "https://www.youtube.com/playlist?list=PL7VdqFXO0Lzdu2U1q-_vZxcuWyqJEitZV",
    source: "Mandarin Corner",
    note: "Nouns, pronouns, numerals, verbs, remaining words.",
    tags: ["vocab"],
  },
  {
    title: "Tones the fun way",
    href: "https://www.youtube.com/watch?v=UuX9F5emdk0",
    source: "Yoyo Chinese",
    note: "Map the four tones onto English intonation you already use.",
    tags: ["pinyin"],
  },
  {
    title: "Introduction to tones",
    href: "https://www.youtube.com/watch?v=PgHelJXrBzM",
    source: "Yoyo Chinese",
    note: "Why tone errors change meaning (panda vs chest hair, etc.).",
    tags: ["pinyin"],
  },
  {
    title: "Tone change & the neutral tone",
    href: "https://www.youtube.com/watch?v=LFgId0qajvE",
    source: "Yoyo Chinese",
    note: "Neutral tone plus the 3+3 sandhi rule.",
    tags: ["pinyin"],
  },
  {
    title: "Tone pairs drill",
    href: "https://www.youtube.com/watch?v=3wV8B4bx1lM",
    source: "Yoyo Chinese",
    note: "Practice every tone combination in pairs.",
    tags: ["pinyin"],
  },
  {
    title: "你好 — HSK 1 Lesson 1 words & texts",
    href: "https://www.youtube.com/watch?v=HfggnY5umdc",
    source: "ChineseFor.Us",
    note: "你 / 您 / 好 and first classroom dialogues.",
    tags: ["greetings"],
  },
  {
    title: "我的家 — comprehensible input",
    href: "https://www.youtube.com/watch?v=rbLlUXT72C4",
    source: "Mandarin Click",
    note: "Slow then normal-speed HSK 1 story about family.",
    tags: ["family", "listening"],
  },
  {
    title: "Beginner HSK 1 listening test",
    href: "https://www.youtube.com/watch?v=kXQSVNAVHEI",
    source: "Mandarin Click",
    note: "Short scored listening practice, HSK 1 vocabulary.",
    tags: ["listening", "exam"],
  },
  {
    title: "HSK 1 past paper H11009 (with answers)",
    href: "https://www.youtube.com/watch?v=CxnFltPPCZ4",
    source: "Learning Chinese",
    note: "Full past paper walkthrough.",
    tags: ["exam", "listening"],
  },
  {
    title: "HSK 1 listening H11009 with answers",
    href: "https://www.youtube.com/watch?v=h73OlDADz6s",
    source: "YouTube",
    note: "Listening section only, official-style audio.",
    tags: ["exam", "listening"],
  },
  {
    title: "ChineseFor.Us free HSK 1 lessons",
    href: "https://chinesefor.us/free-chinese-lessons-videos/",
    source: "ChineseFor.Us",
    note: "Structured Level 1 grammar (在, 住, measure words).",
    tags: ["school", "places"],
  },
  {
    title: "Best YouTube channels for Chinese (2026)",
    href: "https://www.hackingchinese.com/the-best-youtube-channels-for-learning-chinese/",
    source: "Hacking Chinese",
    note: "Curated channels, including beginner / HSK 1 picks.",
    tags: ["vocab"],
  },
];

export const resourcesFor = (tags: string[]) =>
  resources.filter((r) => r.tags.some((t) => tags.includes(t)));
