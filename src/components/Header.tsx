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
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <div className="bg-[#3178c6] text-white text-xs font-bold px-1.5 py-0.5 rounded">
          TS
        </div>
        <span className="text-[#9ca3af] text-sm font-medium">
          Aprende TypeScript
        </span>
        <span className="text-[#4d4d4d] text-sm">En español</span>
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
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Atrás</span>
          </button>
          <button
            onClick={() => next && setCurrentLesson(next.id)}
            disabled={!next}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-[#007acc] text-white font-medium hover:bg-[#006ab3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
