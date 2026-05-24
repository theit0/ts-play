import { Menu, ChevronRight, Map } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdjacentLessons, findLesson, chapters } from "../data/curriculum";
import { useAppStore } from "../store";

export function Header() {
  const { lessonId: currentLessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toggleSidebar, sidebarOpen, completedLessons, lastLessonId } = useAppStore();
  const lesson = findLesson(currentLessonId ?? "");
  const { next } = getAdjacentLessons(currentLessonId ?? "");

  const isHome = !currentLessonId;

  // On the home page, Continuar navigates to the first incomplete or last visited lesson
  const allLessons = chapters.flatMap((c) => c.lessons);
  const firstIncomplete = allLessons.find((l) => !completedLessons.has(l.id));
  const continueTarget = lastLessonId ?? firstIncomplete?.id ?? allLessons[0]?.id;

  const handleContinue = () => {
    if (isHome) navigate(`/lesson/${continueTarget}`);
    else if (next) navigate(`/lesson/${next.id}`);
  };

  const continueDisabled = isHome ? !continueTarget : !next;

  return (
    <header className="h-12 flex items-center px-4 gap-3 border-b border-[var(--vs-border)] flex-shrink-0">
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded text-[var(--vs-muted)] hover:text-[var(--vs-fg)] hover:bg-[var(--vs-hover)] transition-colors"
        title={sidebarOpen ? "Cerrar sidebar" : "Abrir sidebar"}
      >
        <Menu className="w-4 h-4" />
      </button>

      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        title="Volver al mapa"
      >
        <img src="/playts-logo.png" alt="PlayTS" className="h-7 w-7" />
        <span className="text-[var(--vs-subtle)] text-sm font-medium hidden sm:inline">PlayTS</span>
      </button>

      {!isHome && (
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded text-[var(--vs-muted)] hover:text-[var(--vs-fg)] hover:bg-[var(--vs-hover)] transition-colors"
          title="Volver al mapa"
        >
          <Map className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mapa</span>
        </button>
      )}

      <div className="ml-auto flex items-center gap-3">
        {lesson && (
          <span className="text-sm text-[var(--vs-fg)] hidden sm:block">{lesson.title}</span>
        )}

        <button
          onClick={handleContinue}
          disabled={continueDisabled}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-[var(--vs-accent)] text-white font-medium hover:bg-[var(--vs-accent-dark)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Continuar</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
