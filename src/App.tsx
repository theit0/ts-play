import { lazy, Suspense, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
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
  const { setLastLessonId } = useAppStore();
  const lesson = findLesson(lessonId ?? "");

  useEffect(() => {
    document.title = lesson ? `${lesson.title} - PlayTS` : "PlayTS";
  }, [lesson]);

  useEffect(() => {
    const { sidebarOpen: open, toggleSidebar: toggle } = useAppStore.getState();
    if (window.innerWidth < 768 && open) toggle();
    if (lessonId) setLastLessonId(lessonId);
  }, [lessonId, setLastLessonId]);

  if (!lesson) return <Navigate to={`/lesson/${firstLessonId}`} replace />;

  return (
    <Layout>
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
    </Layout>
  );
}
