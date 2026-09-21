const STORE_KEY = "hsk-studies-progress-v1";

export type ModuleProgress = {
  lessonDone: boolean;
  quizBest: number;
  quizLast: number;
  quizAttempts: number;
};

export type ExamAttempt = {
  at: string;
  listening: number;
  reading: number;
  total: number;
  passed: boolean;
};

export type ProgressState = {
  modules: Record<string, ModuleProgress>;
  examAttempts: ExamAttempt[];
  seen: string[];
};

const empty = (): ProgressState => ({
  modules: {},
  examAttempts: [],
  seen: [],
});

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

export function saveProgress(state: ProgressState) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function moduleComplete(p?: ModuleProgress) {
  return Boolean(p?.lessonDone && (p.quizBest ?? 0) >= 70);
}

export function resetProgress() {
  localStorage.removeItem(STORE_KEY);
}
