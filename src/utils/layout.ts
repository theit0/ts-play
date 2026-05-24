import { chapters } from "../data/curriculum";

export const CHAPTER_COLORS = [
  { bg: "#1d4ed8", progress: "#3b82f6" },
  { bg: "#7c3aed", progress: "#8b5cf6" },
  { bg: "#047857", progress: "#10b981" },
  { bg: "#b45309", progress: "#f59e0b" },
  { bg: "#be185d", progress: "#ec4899" },
  { bg: "#0e7490", progress: "#06b6d4" },
  { bg: "#9a3412", progress: "#f97316" },
  { bg: "#3730a3", progress: "#6366f1" },
  { bg: "#065f46", progress: "#14b8a6" },
  { bg: "#6d28d9", progress: "#a855f7" },
];

export const PATH_W   = 360;
export const CENTER_X = PATH_W / 2;
export const NODE_R   = 36;
export const LESSON_H = 108;
export const HEADER_H = 52;
export const PAD_TOP  = 28;
export const CH_GAP   = 8;
export const OUTER_Y  = 24;

export const ZIGZAG_X = [0, 72, 0, -72];

export interface NodeInfo   { 
  x: number; 
  y: number; 
  lessonId: string; 
  chapterIdx: number; 
  localIdx: number 
}
export interface HeaderInfo { 
  y: number; 
  chapterIdx: number; 
  absY: number 
}

export type NodeState = "done" | "active" | "todo";

export function computeLayout() {
  let y = PAD_TOP;
  const nodes: NodeInfo[]    = [];
  const headers: HeaderInfo[] = [];

  chapters.forEach((chapter, chIdx) => {
    headers.push({ y, chapterIdx: chIdx, absY: OUTER_Y + y });
    y += HEADER_H;

    chapter.lessons.forEach((_, localIdx) => {
      nodes.push({
        x: CENTER_X + ZIGZAG_X[localIdx % ZIGZAG_X.length],
        y: y + NODE_R,
        lessonId: chapter.lessons[localIdx].id,
        chapterIdx: chIdx,
        localIdx,
      });
      y += LESSON_H;
    });

    y += CH_GAP;
  });

  return { nodes, headers, totalHeight: y + 40 };
}

export function buildSvgPath(nodes: NodeInfo[]): string {
  if (nodes.length < 2) return "";
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const p = nodes[i - 1], c = nodes[i];
    const midY = (p.y + c.y) / 2;
    d += ` C ${p.x} ${midY}, ${c.x} ${midY}, ${c.x} ${c.y}`;
  }
  return d;
}
