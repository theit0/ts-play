import { Code2, BookOpen, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { chapters, allLessons } from "../data/curriculum";
import { useAppStore } from "../store";

function LessonIcon({ type }: { type: "explanation" | "exercise" }) {
  if (type === "exercise") return <Code2 className="w-3.5 h-3.5 flex-shrink-0" />;
  return <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />;
}

export function Sidebar() {
  const { lessonId: currentLessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { completedLessons } = useAppStore();
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
      </div>
      <div className="flex-1 overflow-y-auto py-3 min-h-0">
        {chapters.map((chapter) => (
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
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
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
