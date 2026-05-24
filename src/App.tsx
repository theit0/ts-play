import { lazy, Suspense, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { findLesson, firstLessonId } from "./data/curriculum";
import { useAppStore } from "./store";

const ExplanationLesson = lazy(() =>
  import("./components/ExplanationLesson").then((m) => ({ default: m.ExplanationLesson }))
);
const ExerciseLesson = lazy(() =>
  import("./components/ExerciseLesson").then((m) => ({ default: m.ExerciseLesson }))
);

export default function App() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { sidebarOpen, toggleSidebar, setLastLessonId } = useAppStore();
  const lesson = findLesson(lessonId ?? "");

  useEffect(() => {
    document.title = lesson ? `${lesson.title} - PlayTS` : "PlayTS";
  }, [lesson]);

  useEffect(() => {
    const { sidebarOpen: open, toggleSidebar: toggle } = useAppStore.getState();
    if (window.innerWidth < 768 && open) toggle();
    if (lessonId) setLastLessonId(lessonId);
  }, [lessonId]);

  if (!lesson) return <Navigate to={`/lesson/${firstLessonId}`} replace />;

  return (
    <div className="h-screen flex flex-col bg-[var(--vs-bg)] text-[var(--vs-fg)] overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0 relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        {sidebarOpen && (
          <aside className="fixed top-0 left-0 h-screen z-30 md:static md:h-auto md:z-auto w-64 flex-shrink-0 bg-[var(--vs-surface)] border-r border-[var(--vs-border)] flex flex-col">
            <Sidebar />
          </aside>
        )}
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          <ErrorBoundary key={lesson.id}>
            <Suspense fallback={<div className="flex-1 bg-[var(--vs-bg)]" />}>
              {lesson.type === "explanation" ? (
                <ExplanationLesson key={lesson.id} lesson={lesson} />
              ) : (
                <ExerciseLesson key={lesson.id} lesson={lesson} />
              )}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
