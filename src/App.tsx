import { useMemo, useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProgressContext, type ProgressApi } from "./lib/context";
import { loadProgress, resetProgress, saveProgress, type ExamAttempt, type ProgressState } from "./lib/progress";
import { Home } from "./pages/Home";
import { ModulePage } from "./pages/ModulePage";
import { ExamPage } from "./pages/ExamPage";
import { ProgressPage } from "./pages/ProgressPage";
import { GlossaryPage } from "./pages/GlossaryPage";

function Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress());

  const api = useMemo<ProgressApi>(() => {
    const commit = (next: ProgressState) => {
      setState(next);
      saveProgress(next);
    };
    return {
      state,
      module: (id) => state.modules[id],
      markLesson: (id) => {
        const prev = state.modules[id] ?? { lessonDone: false, quizBest: 0, quizLast: 0, quizAttempts: 0 };
        commit({ ...state, modules: { ...state.modules, [id]: { ...prev, lessonDone: true } } });
      },
      recordQuiz: (id, score) => {
        const prev = state.modules[id] ?? { lessonDone: false, quizBest: 0, quizLast: 0, quizAttempts: 0 };
        commit({
          ...state,
          modules: {
            ...state.modules,
            [id]: {
              ...prev,
              lessonDone: true,
              quizLast: score,
              quizBest: Math.max(prev.quizBest, score),
              quizAttempts: prev.quizAttempts + 1,
            },
          },
        });
      },
      markSeen: (hanzi) => {
        commit({ ...state, seen: Array.from(new Set([...state.seen, ...hanzi])) });
      },
      recordExam: (attempt: ExamAttempt) => {
        commit({ ...state, examAttempts: [attempt, ...state.examAttempts].slice(0, 12) });
      },
      reset: () => {
        resetProgress();
        setState({ modules: {}, examAttempts: [], seen: [] });
      },
    };
  }, [state]);

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export default function App() {
  return (
    <Provider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/learn/:id" element={<ModulePage />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
