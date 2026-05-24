import { Code2, BookOpen, Check } from "lucide-react";
import { chapters } from "../data/curriculum";
import { useAppStore } from "../store";

function LessonIcon({ type }: { type: "explanation" | "exercise" }) {
  if (type === "exercise") return <Code2 className="w-3.5 h-3.5 flex-shrink-0" />;
  return <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />;
}

export function Sidebar() {
  const { currentLessonId, completedLessons, setCurrentLesson } = useAppStore();

  return (
    <div className="h-full overflow-y-auto py-3">
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
                  onClick={() => setCurrentLesson(lesson.id)}
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
  );
}
