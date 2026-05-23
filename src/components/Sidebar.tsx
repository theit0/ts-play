import { chapters } from "../data/curriculum";
import { useAppStore } from "../store";

function LessonIcon({ type }: { type: "explanation" | "exercise" }) {
  if (type === "exercise") {
    return (
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
        <path d="M5 4l-3 4 3 4M11 4l3 4-3 4M9 3l-2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
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
                      ? "bg-[#242440] text-[#e8e8f0]"
                      : "text-[#9ca3af] hover:bg-[#1e1e38] hover:text-[#e8e8f0]"
                  }`}
                >
                  <span
                    className={
                      isDone ? "text-[#f59e0b]" : isActive ? "text-[#00d4aa]" : "text-[#4b5563]"
                    }
                  >
                    <LessonIcon type={lesson.type} />
                  </span>
                  <span className="truncate">{lesson.title}</span>
                  {isDone && (
                    <span className="ml-auto flex-shrink-0 text-[#f59e0b]">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.5 4.5l-7 7L3 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="px-4 py-6 text-xs text-[#4b5563] border-t border-[#2a2a45] mt-4">
        Otros cursos por Jad »
      </div>
    </div>
  );
}
