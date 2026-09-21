import { createContext, useContext } from "react";
import type { ExamAttempt, ModuleProgress, ProgressState } from "./progress";

export type ProgressApi = {
  state: ProgressState;
  markLesson: (id: string) => void;
  recordQuiz: (id: string, score: number) => void;
  markSeen: (hanzi: string[]) => void;
  recordExam: (attempt: ExamAttempt) => void;
  reset: () => void;
  module: (id: string) => ModuleProgress | undefined;
};

export const ProgressContext = createContext<ProgressApi | null>(null);

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("ProgressContext missing");
  return ctx;
}
