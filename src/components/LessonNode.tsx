import { useState } from "react";
import { Check, Star, Code2, BookOpen } from "lucide-react";
import type { Lesson } from "../data/types";
import { NODE_R } from "../utils/layout";
import type { NodeState } from "../utils/layout";
import { NodeTooltip } from "./NodeTooltip";

export function LessonNode({ x, y, lesson, state, localIdx, onNavigate }: {
  x: number; y: number; lesson: Lesson; state: NodeState; localIdx: number; onNavigate: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const tooltipRight = localIdx % 4 === 0 || localIdx % 4 === 3;

  return (
    <div style={{ position: "absolute", left: x - NODE_R, top: y - NODE_R, width: NODE_R * 2, height: NODE_R * 2, zIndex: 2 }}>
      {state === "active" && (
        <div className="absolute rounded-full animate-ping bg-blue-400 pointer-events-none" style={{ inset: -6, opacity: 0.2 }} />
      )}

      <button
        onClick={onNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative w-full h-full rounded-full flex items-center justify-center cursor-pointer lesson-node state-${state}`}
      >
        {state === "done"            ? <Check    size={22} strokeWidth={3} />
        : state === "active"         ? <Star     size={20} />
        : lesson.type === "exercise" ? <Code2    size={18} />
        :                              <BookOpen size={18} />}
      </button>

      {hovered && <NodeTooltip lesson={lesson} right={tooltipRight} />}
    </div>
  );
}
