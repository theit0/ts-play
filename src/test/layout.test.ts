import { describe, it, expect } from "vitest";
import {
  computeLayout,
  buildSvgPath,
  CHAPTER_COLORS,
  PATH_W,
  CENTER_X,
  ZIGZAG_X,
  NODE_R,
  LESSON_H,
  HEADER_H,
  PAD_TOP,
  CH_GAP,
  OUTER_Y,
} from "../utils/layout";
import { chapters } from "../data/curriculum";

const totalLessons = chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);

// ─── Constants ────────────────────────────────────────────────

describe("layout constants", () => {
  it("CENTER_X is exactly half of PATH_W", () => {
    expect(CENTER_X).toBe(PATH_W / 2);
  });

  it("ZIGZAG_X has exactly 4 offsets", () => {
    expect(ZIGZAG_X).toHaveLength(4);
  });

  it("CHAPTER_COLORS has exactly 10 entries", () => {
    expect(CHAPTER_COLORS).toHaveLength(10);
  });

  it("every CHAPTER_COLORS entry has bg and progress strings", () => {
    for (const color of CHAPTER_COLORS) {
      expect(typeof color.bg).toBe("string");
      expect(typeof color.progress).toBe("string");
    }
  });

  it("all positive numeric constants are positive", () => {
    expect(PATH_W).toBeGreaterThan(0);
    expect(NODE_R).toBeGreaterThan(0);
    expect(LESSON_H).toBeGreaterThan(0);
    expect(HEADER_H).toBeGreaterThan(0);
    expect(PAD_TOP).toBeGreaterThan(0);
    expect(CH_GAP).toBeGreaterThan(0);
    expect(OUTER_Y).toBeGreaterThan(0);
  });
});

// ─── computeLayout ────────────────────────────────────────────

describe("computeLayout", () => {
  const { nodes, headers, totalHeight } = computeLayout();

  it("produces one node per lesson across all chapters", () => {
    expect(nodes).toHaveLength(totalLessons);
  });

  it("produces one header per chapter", () => {
    expect(headers).toHaveLength(chapters.length);
  });

  it("totalHeight is positive", () => {
    expect(totalHeight).toBeGreaterThan(0);
  });

  it("node lessonIds match curriculum order", () => {
    const allLessons = chapters.flatMap((c) => c.lessons);
    nodes.forEach((node, i) => {
      expect(node.lessonId).toBe(allLessons[i].id);
    });
  });

  it("node y positions are strictly increasing", () => {
    for (let i = 1; i < nodes.length; i++) {
      expect(nodes[i].y).toBeGreaterThan(nodes[i - 1].y);
    }
  });

  it("node x positions follow zigzag offsets", () => {
    nodes.forEach((node) => {
      const expected = CENTER_X + ZIGZAG_X[node.localIdx % ZIGZAG_X.length];
      expect(node.x).toBe(expected);
    });
  });

  it("chapterIdx values are within chapter bounds", () => {
    nodes.forEach((node) => {
      expect(node.chapterIdx).toBeGreaterThanOrEqual(0);
      expect(node.chapterIdx).toBeLessThan(chapters.length);
    });
  });

  it("localIdx resets to 0 at each new chapter", () => {
    let expectedLocal = 0;
    let lastChapterIdx = nodes[0].chapterIdx;

    for (const node of nodes) {
      if (node.chapterIdx !== lastChapterIdx) {
        expectedLocal = 0;
        lastChapterIdx = node.chapterIdx;
      }
      expect(node.localIdx).toBe(expectedLocal);
      expectedLocal++;
    }
  });

  it("header absY equals OUTER_Y + header.y", () => {
    headers.forEach((h) => {
      expect(h.absY).toBe(OUTER_Y + h.y);
    });
  });

  it("header chapterIdx values are sequential 0..n-1", () => {
    headers.forEach((h, i) => {
      expect(h.chapterIdx).toBe(i);
    });
  });
});

// ─── buildSvgPath ─────────────────────────────────────────────

describe("buildSvgPath", () => {
  it("returns empty string for empty node list", () => {
    expect(buildSvgPath([])).toBe("");
  });

  it("returns empty string for a single node", () => {
    const [first] = computeLayout().nodes;
    expect(buildSvgPath([first])).toBe("");
  });

  it("starts with 'M' for two or more nodes", () => {
    const { nodes } = computeLayout();
    const path = buildSvgPath(nodes.slice(0, 2));
    expect(path.startsWith("M ")).toBe(true);
  });

  it("contains exactly (n-1) cubic bezier segments for n nodes", () => {
    const { nodes } = computeLayout();
    const sample = nodes.slice(0, 5);
    const path = buildSvgPath(sample);
    const segments = path.match(/ C /g) ?? [];
    expect(segments).toHaveLength(sample.length - 1);
  });

  it("encodes first node coordinates in the M command", () => {
    const { nodes } = computeLayout();
    const [first] = nodes;
    const path = buildSvgPath(nodes.slice(0, 2));
    expect(path).toContain(`M ${first.x} ${first.y}`);
  });

  it("full path encodes all lesson nodes", () => {
    const { nodes } = computeLayout();
    const path = buildSvgPath(nodes);
    const segments = path.match(/ C /g) ?? [];
    expect(segments).toHaveLength(nodes.length - 1);
  });
});
