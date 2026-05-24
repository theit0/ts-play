import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { chapters, allLessons } from "../data/curriculum";
import { useAppStore } from "../store";
import { ArrowUp } from "lucide-react";
import { Layout } from "../components/Layout";
import { navigateTo } from "../utils/navigation";
import { ChapterBanner } from "../components/ChapterBanner";
import { ChapterDivider } from "../components/ChapterDivider";
import { LessonNode } from "../components/LessonNode";
import { ChapterPanel } from "../components/ChapterPanel";
import { computeLayout, buildSvgPath, PATH_W, NODE_R, OUTER_Y } from "../utils/layout";
import { TIMING } from "../config";
import type { NodeState } from "../utils/layout";

export function HomePage() {
  const navigate = useNavigate();
  const { completedLessons } = useAppStore();
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { nodes, headers, totalHeight } = useMemo(() => computeLayout(), []);
  const firstIncomplete = allLessons.findIndex((l) => !completedLessons.has(l.id));
  const activeLessonId  = firstIncomplete >= 0 ? allLessons[firstIncomplete].id : null;

  const svgPath = useMemo(() => buildSvgPath(nodes), [nodes]);

  function getState(lessonId: string): NodeState {
    if (completedLessons.has(lessonId)) return "done";
    if (lessonId === activeLessonId)    return "active";
    return "todo";
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const top = e.currentTarget.scrollTop;
    setScrolled(top > 100);
    let active = 0;
    headers.forEach(({ absY, chapterIdx }) => { if (top >= absY - 60) active = chapterIdx; });
    setCurrentChapterIdx(active);
  }

  useEffect(() => {
    const activeNode = nodes.find((n) => n.lessonId === activeLessonId);
    if (!activeNode || !scrollRef.current) return;
    const top = Math.max(0, OUTER_Y + activeNode.y - NODE_R - 120);
    const timer = setTimeout(() => scrollRef.current?.scrollTo({ top, behavior: "smooth" }), TIMING.SCROLL_TO_LESSON_DELAY);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <ChapterBanner chapterIdx={currentChapterIdx} />

        <div className="flex-1 overflow-y-auto" ref={scrollRef} onScroll={handleScroll}>
          <div className="flex justify-center py-6 px-4 pt-0">
            <div className="relative flex-shrink-0" style={{ width: PATH_W, height: totalHeight }}>

              <svg width={PATH_W} height={totalHeight} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }}>
                <path d={svgPath} stroke="#ffffff" strokeWidth="8"  fill="none" strokeLinecap="round" opacity="0.04" />
                <path d={svgPath} stroke="#3178c6" strokeWidth="5"  fill="none" strokeLinecap="round" opacity="0.15" strokeDasharray="1 14" />
              </svg>

              {headers.map(({ y, chapterIdx }) => (
                <ChapterDivider key={chapters[chapterIdx].id} y={y} chapterIdx={chapterIdx} />
              ))}

              {nodes.map(({ x, y, lessonId, chapterIdx, localIdx }) => (
                <LessonNode
                  key={lessonId}
                  x={x} y={y}
                  lesson={chapters[chapterIdx].lessons[localIdx]}
                  state={getState(lessonId)}
                  chapterIdx={chapterIdx}
                  onNavigate={() => navigateTo(navigate, `/lesson/${lessonId}`)}
                />
              ))}
            </div>
          </div>
        </div>

        {scrolled && (
          <button
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="absolute bottom-6 right-6 z-10 w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: "var(--vs-accent)", boxShadow: "0 4px 0 var(--vs-accent-dark)" }}
            aria-label="Ir arriba"
            title="Ir arriba"
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        )}
      </main>

      <ChapterPanel completedLessons={completedLessons} />
    </Layout>
  );
}
