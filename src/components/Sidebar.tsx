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
          <div className="px-4 py-2 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
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
                      ? "bg-[#37373d] text-[#d4d4d4]"
                      : "text-[#9ca3af] hover:bg-[#2a2a2a] hover:text-[#d4d4d4]"
                  }`}
                >
                  <span
                    className={
                      isDone ? "text-[#4ec9b0]" : isActive ? "text-[#007acc]" : "text-[#4d4d4d]"
                    }
                  >
                    <LessonIcon type={lesson.type} />
                  </span>
                  <span className="truncate">{lesson.title}</span>
                  {isDone && (
                    <span className="ml-auto flex-shrink-0 text-[#4ec9b0]">
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
