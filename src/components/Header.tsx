import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { getAdjacentLessons, findLesson } from "../data/curriculum";
import { useAppStore } from "../store";

export function Header() {
  const { currentLessonId, setCurrentLesson, toggleSidebar, sidebarOpen } =
    useAppStore();
  const lesson = findLesson(currentLessonId);
  const { prev, next } = getAdjacentLessons(currentLessonId);

  return (
    <header className="h-12 flex items-center px-4 gap-3 border-b border-[var(--vs-border)] flex-shrink-0">
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded text-[var(--vs-muted)] hover:text-[var(--vs-fg)] hover:bg-[var(--vs-hover)] transition-colors"
        title={sidebarOpen ? "Cerrar sidebar" : "Abrir sidebar"}
      >
        <Menu className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2">
        <img src="/playts-logo.png" alt="PlayTS" className="h-7 w-7" />
        <span className="text-[var(--vs-subtle)] text-sm font-medium">PlayTS</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {lesson && (
          <span className="text-sm text-[var(--vs-fg)] hidden sm:block">{lesson.title}</span>
        )}

        <div className="flex gap-1">
          <button
            onClick={() => prev && setCurrentLesson(prev.id)}
            disabled={!prev}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded text-[var(--vs-subtle)] hover:text-[var(--vs-fg)] hover:bg-[var(--vs-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Atrás</span>
          </button>
          <button
            onClick={() => next && setCurrentLesson(next.id)}
            disabled={!next}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-[var(--vs-accent)] text-white font-medium hover:bg-[var(--vs-accent-dark)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
