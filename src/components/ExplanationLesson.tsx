import { Check, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Lesson } from "../data/types";
import { useAppStore } from "../store";
import { getAdjacentLessons } from "../data/curriculum";
import { MarkdownContent } from "./MarkdownContent";

interface Props {
  lesson: Lesson;
}

export function ExplanationLesson({ lesson }: Props) {
  const navigate = useNavigate();
  const { markComplete, completedLessons } = useAppStore();
  const isDone = completedLessons.has(lesson.id);
  const { next } = getAdjacentLessons(lesson.id);

  function handleContinue() {
    markComplete(lesson.id);
    if (next) navigate(`/lesson/${next.id}`);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <article>
          <MarkdownContent content={lesson.content ?? ""} />
        </article>

        <div className="mt-10 flex items-center justify-between">
          <span className="text-sm text-[var(--vs-success)] flex items-center gap-1">
            {isDone && <><Check className="w-4 h-4" /> Completada</>}
          </span>
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-[var(--vs-accent)] text-white font-semibold text-sm hover:bg-[var(--vs-accent-dark)] transition-colors"
          >
            {next ? "Continuar" : "Finalizar capítulo"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
