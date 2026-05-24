import { describe, it, expect } from "vitest";
import { chapters, findLesson, getAdjacentLessons, firstLessonId } from "../data/curriculum";

describe("chapters", () => {
  it("has exactly 10 chapters", () => {
    expect(chapters).toHaveLength(10);
  });

  it("each chapter has at least one lesson", () => {
    for (const chapter of chapters) {
      expect(chapter.lessons.length).toBeGreaterThan(0);
    }
  });

  it("all lesson IDs are unique across the curriculum", () => {
    const ids = chapters.flatMap((c) => c.lessons.map((l) => l.id));
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe("firstLessonId", () => {
  it("matches the first lesson of the first chapter", () => {
    expect(firstLessonId).toBe(chapters[0].lessons[0].id);
  });

  it("is a non-empty string", () => {
    expect(typeof firstLessonId).toBe("string");
    expect(firstLessonId.length).toBeGreaterThan(0);
  });
});

describe("findLesson", () => {
  it("finds an existing lesson by ID", () => {
    const lesson = findLesson(firstLessonId);
    expect(lesson).toBeDefined();
    expect(lesson?.id).toBe(firstLessonId);
  });

  it("returns undefined for a non-existent ID", () => {
    expect(findLesson("does-not-exist")).toBeUndefined();
  });

  it("finds lessons from later chapters", () => {
    const lastChapter = chapters[chapters.length - 1];
    const lastLesson = lastChapter.lessons[lastChapter.lessons.length - 1];
    const found = findLesson(lastLesson.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(lastLesson.id);
  });
});

describe("getAdjacentLessons", () => {
  it("returns null prev for the first lesson", () => {
    const { prev } = getAdjacentLessons(firstLessonId);
    expect(prev).toBeNull();
  });

  it("returns a next lesson for the first lesson", () => {
    const { next } = getAdjacentLessons(firstLessonId);
    expect(next).not.toBeNull();
  });

  it("returns null next for the last lesson", () => {
    const allLessons = chapters.flatMap((c) => c.lessons);
    const lastId = allLessons[allLessons.length - 1].id;
    const { next } = getAdjacentLessons(lastId);
    expect(next).toBeNull();
  });

  it("returns non-null prev for the last lesson", () => {
    const allLessons = chapters.flatMap((c) => c.lessons);
    const lastId = allLessons[allLessons.length - 1].id;
    const { prev } = getAdjacentLessons(lastId);
    expect(prev).not.toBeNull();
  });

  it("returns correct prev and next for a middle lesson", () => {
    const allLessons = chapters.flatMap((c) => c.lessons);
    const midIdx = Math.floor(allLessons.length / 2);
    const midId = allLessons[midIdx].id;
    const { prev, next } = getAdjacentLessons(midId);
    expect(prev?.id).toBe(allLessons[midIdx - 1].id);
    expect(next?.id).toBe(allLessons[midIdx + 1].id);
  });

  it("returns null for both when ID does not exist", () => {
    const { prev, next } = getAdjacentLessons("nonexistent-id");
    expect(prev).toBeNull();
    expect(next).toBeNull();
  });
});
