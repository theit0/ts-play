import { useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ExplanationLesson } from "./components/ExplanationLesson";
import { ExerciseLesson } from "./components/ExerciseLesson";
import { findLesson } from "./data/curriculum";
import { useAppStore } from "./store";

export default function App() {
  const { currentLessonId, sidebarOpen } = useAppStore();
  const lesson = findLesson(currentLessonId);

  useEffect(() => {
    document.title = lesson ? `${lesson.title} — PlayTS` : "PlayTS";
  }, [lesson]);

  if (!lesson) return null;

  return (
    <div className="h-screen flex flex-col bg-[var(--vs-bg)] text-[var(--vs-fg)] overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0">
        {sidebarOpen && (
          <aside className="w-64 flex-shrink-0 bg-[var(--vs-surface)] border-r border-[var(--vs-border)] flex flex-col">
            <Sidebar />
          </aside>
        )}
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          {lesson.type === "explanation" ? (
            <ExplanationLesson key={lesson.id} lesson={lesson} />
          ) : (
            <ExerciseLesson key={lesson.id} lesson={lesson} />
          )}
        </main>
      </div>
    </div>
  );
}
