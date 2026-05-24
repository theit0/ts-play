import { chapters } from "../data/curriculum";
import { CHAPTER_COLORS, PATH_W } from "../utils/layout";

export function ChapterBanner({ chapterIdx }: { chapterIdx: number }) {
  const color = CHAPTER_COLORS[chapterIdx % CHAPTER_COLORS.length];
  return (
    <div className="flex-shrink-0 flex justify-center px-4 py-3 pt-8">
      <div
        className="rounded-2xl px-6 py-4"
        style={{ width: PATH_W, backgroundColor: color.bg, transition: "background-color 0.35s ease" }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-0.5">
          Capítulo {chapterIdx + 1}
        </div>
        <div className="text-lg font-black text-white leading-tight">
          {chapters[chapterIdx].title}
        </div>
      </div>
    </div>
  );
}
