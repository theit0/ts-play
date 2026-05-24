import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { getAdjacentLessons, findLesson } from "../data/curriculum";
import { useAppStore } from "../store";

export function Header() {
  const { currentLessonId, setCurrentLesson, toggleSidebar, sidebarOpen } =
    useAppStore();
  const lesson = findLesson(currentLessonId);
  const { prev, next } = getAdjacentLessons(currentLessonId);

  return (
    <header className="h-12 flex items-center px-4 gap-3 border-b border-[#3e3e42] flex-shrink-0">
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded text-[#6b7280] hover:text-[#d4d4d4] hover:bg-[#37373d] transition-colors"
        title={sidebarOpen ? "Cerrar sidebar" : "Abrir sidebar"}
      >
        <Menu className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2">
        <img src="/playts-logo.png" alt="PlayTS" className="h-7 w-7" />
        <span className="text-[#9ca3af] text-sm font-medium">
          PlayTS
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {lesson && (
          <span className="text-sm text-[#d4d4d4] hidden sm:block">
            {lesson.title}
          </span>
        )}
        <div className="flex gap-1">
          <button
            onClick={() => prev && setCurrentLesson(prev.id)}
            disabled={!prev}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded text-[#9ca3af] hover:text-[#d4d4d4] hover:bg-[#37373d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Atrás</span>
          </button>
          <button
            onClick={() => next && setCurrentLesson(next.id)}
            disabled={!next}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-[#007acc] text-white font-medium hover:bg-[#006ab3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
