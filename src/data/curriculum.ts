import type { Chapter, Lesson } from "./types";

const chapterModules = import.meta.glob<Record<string, Chapter>>(
  "./chapters/*.ts",
  { eager: true }
);

export const chapters: Chapter[] = Object.entries(chapterModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, mod]) => Object.values(mod)[0] as Chapter);

export const allLessons: Lesson[] = chapters.flatMap((c) => c.lessons);
const lessonIndexMap = new Map(allLessons.map((l, i) => [l.id, i]));

export function findLesson(lessonId: string): Lesson | undefined {
  const idx = lessonIndexMap.get(lessonId);
  return idx !== undefined ? allLessons[idx] : undefined;
}

export function getAdjacentLessons(lessonId: string): {
  prev: Lesson | null;
  next: Lesson | null;
} {
  const idx = lessonIndexMap.get(lessonId) ?? -1;
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
  };
}

export const firstLessonId = chapters[0]?.lessons[0]?.id ?? "";
