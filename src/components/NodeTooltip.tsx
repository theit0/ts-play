import { BookOpen, Code2 } from "lucide-react";
import type { Lesson } from "../data/types";

const caret: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%) rotate(45deg)",
  width: 8, height: 8,
  background: "var(--vs-elevated)",
  left: -5,
  borderLeft: "1px solid var(--vs-border)",
  borderBottom: "1px solid var(--vs-border)",
};

export function NodeTooltip({ lesson }: { lesson: Lesson }) {
  return (
    <div
      className="pointer-events-none"
      style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 10, left: "calc(100% + 14px)" }}
    >
      <div
        className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--vs-fg)] leading-snug whitespace-nowrap"
        style={{ background: "var(--vs-elevated)", border: "1px solid var(--vs-border)", boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}
      >
        {lesson.type === "exercise"
          ? <Code2    size={13} className="text-[var(--vs-muted)] flex-shrink-0" />
          : <BookOpen size={13} className="text-[var(--vs-muted)] flex-shrink-0" />}
        {lesson.title}
        <div style={caret} />
      </div>
    </div>
  );
}
