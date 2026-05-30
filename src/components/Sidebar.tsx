import { Code2, BookOpen, Check, Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chapters, allLessons } from "../data/curriculum";
import { useAppStore } from "../store";
import { navigateTo } from "../utils/navigation";

function LessonIcon({ type }: { type: "explanation" | "exercise" }) {
  if (type === "exercise") return <Code2 className="w-3.5 h-3.5 flex-shrink-0" />;
  return <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />;
}

export function Sidebar() {
  const { lessonId: currentLessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { completedLessons } = useAppStore();
  const [query, setQuery] = useState("");
  const totalLessons = allLessons.length;
  const completedCount = completedLessons.size;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 py-3 border-b border-[var(--vs-border)] bg-[var(--vs-surface)]">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-[var(--vs-subtle)] uppercase tracking-wider">Progreso</span>
          <span className="text-xs text-[var(--vs-muted)] tabular-nums font-semibold">
            {completedCount}/{totalLessons} ({progressPct}%)
          </span>
        </div>
        <div className="w-full h-1.5 bg-[var(--vs-elevated)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--vs-accent)] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="relative mt-2.5">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--vs-dim)] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar lección..."
            className="w-full pl-7 pr-6 py-1.5 text-xs bg-[var(--vs-elevated)] border border-[var(--vs-border)] rounded text-[var(--vs-fg)] placeholder:text-[var(--vs-dim)] focus:outline-none focus:border-[var(--vs-accent)]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--vs-dim)] hover:text-[var(--vs-fg)]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-3 min-h-0">
        {query.trim() ? (
          (() => {
            const q = query.trim().toLowerCase();
            const results = allLessons.filter((l) => l.title.toLowerCase().includes(q));
            if (!results.length) return (
              <div className="flex flex-col items-center gap-2 px-4 py-6 text-[var(--vs-dim)]">
                <Search className="w-5 h-5" />
                <p className="text-xs">Sin resultados</p>
              </div>
            );
            return results.map((lesson) => {
              const isActive = lesson.id === currentLessonId;
              const isDone = completedLessons.has(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => navigateTo(navigate, `/lesson/${lesson.id}`)}
                  className={`w-full flex items-center gap-2.5 px-4 py-1.5 text-sm text-left transition-colors ${
                    isActive
                      ? "bg-[var(--vs-hover)] text-[var(--vs-fg)]"
                      : "text-[var(--vs-subtle)] hover:bg-[var(--vs-elevated)] hover:text-[var(--vs-fg)]"
                  }`}
                >
                  <span className={isDone ? "text-[var(--vs-success)]" : isActive ? "text-[var(--vs-accent)]" : "text-[var(--vs-dim)]"}>
                    <LessonIcon type={lesson.type} />
                  </span>
                  <span className="truncate">{lesson.title}</span>
                  {isDone && <span className="ml-auto flex-shrink-0 text-[var(--vs-success)]"><Check className="w-3.5 h-3.5" /></span>}
                </button>
              );
            });
          })()
        ) : chapters.map((chapter) => (
          <div key={chapter.id} className="mb-1">
            <div className="px-4 py-2 text-xs font-semibold text-[var(--vs-subtle)] uppercase tracking-wider">
              {chapter.id.replace("ch", "")}. {chapter.title}
            </div>
            <div>
              {chapter.lessons.map((lesson) => {
                const isActive = lesson.id === currentLessonId;
                const isDone = completedLessons.has(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => navigateTo(navigate, `/lesson/${lesson.id}`)}
                    className={`w-full flex items-center gap-2.5 px-4 py-1.5 text-sm text-left transition-colors ${
                      isActive
                        ? "bg-[var(--vs-hover)] text-[var(--vs-fg)]"
                        : "text-[var(--vs-subtle)] hover:bg-[var(--vs-elevated)] hover:text-[var(--vs-fg)]"
                    }`}
                  >
                    <span
                      className={
                        isDone
                          ? "text-[var(--vs-success)]"
                          : isActive
                          ? "text-[var(--vs-accent)]"
                          : "text-[var(--vs-dim)]"
                      }
                    >
                      <LessonIcon type={lesson.type} />
                    </span>
                    <span className="truncate">{lesson.title}</span>
                    {isDone && (
                      <span className="ml-auto flex-shrink-0 text-[var(--vs-success)]">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
