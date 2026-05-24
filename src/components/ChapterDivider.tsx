import { chapters } from "../data/curriculum";
import { PATH_W, HEADER_H } from "../utils/layout";

export function ChapterDivider({ y, chapterIdx }: { y: number; chapterIdx: number }) {
  const line  ={ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" } as const;

  return (
    <div style={{ position: "absolute", top: y, left: 0, width: PATH_W, height: HEADER_H, zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={line} />
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--vs-muted)", whiteSpace: "nowrap", padding: "4px 12px", backgroundColor: "var(--vs-bg)" }}>
        {chapters[chapterIdx].title}
      </span>
      <div style={line} />
    </div>
  );
}
