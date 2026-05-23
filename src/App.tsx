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

  // Keyboard shortcut: Ctrl+Enter = run (handled inside ExerciseLesson via editor)
  useEffect(() => {
    document.title = lesson ? `${lesson.title} — Aprende TypeScript` : "Aprende TypeScript";
  }, [lesson]);

  if (!lesson) return null;

  return (
    <div className="h-screen flex flex-col bg-[#0e0e1a] text-[#e8e8f0] overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 flex-shrink-0 bg-[#141428] border-r border-[#2a2a45] flex flex-col">
            <Sidebar />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          {lesson.type === "explanation" ? (
            <ExplanationLesson lesson={lesson} />
          ) : (
            <ExerciseLesson lesson={lesson} />
          )}
        </main>
      </div>
    </div>
  );
}
