import { chapters } from "../data/curriculum";
import { CHAPTER_COLORS } from "../utils/layout";

export function ChapterPanel({ completedLessons }: { completedLessons: Set<string> }) {
  return (
    <aside className="hidden xl:flex w-72 flex-shrink-0 border-l border-[var(--vs-border)] p-6 overflow-y-auto flex-col gap-4 bg-[var(--vs-surface)]">
      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--vs-fg)]/40">
        Capítulos
      </div>
      <div className="flex flex-col gap-3">
        {chapters.map((ch, idx) => {
          const done  = ch.lessons.filter((l) => completedLessons.has(l.id)).length;
          const total = ch.lessons.length;
          const color = CHAPTER_COLORS[idx % CHAPTER_COLORS.length];
          return (
            <div key={ch.id}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[var(--vs-fg)]/70 truncate max-w-[180px]">{ch.title}</span>
                <span className="text-[var(--vs-fg)]/40 ml-2 flex-shrink-0">{done}/{total}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--vs-hover)] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(done / total) * 100}%`, backgroundColor: color.progress }} />
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
