import { ch01 } from "./chapters/ch01";
import { ch02 } from "./chapters/ch02";
import { ch03 } from "./chapters/ch03";
import { ch04 } from "./chapters/ch04";
import { ch05 } from "./chapters/ch05";
import { ch06 } from "./chapters/ch06";
import { ch07 } from "./chapters/ch07";
import { ch08 } from "./chapters/ch08";
import { ch09 } from "./chapters/ch09";
import { ch10 } from "./chapters/ch10";
import type { Chapter, Lesson } from "./types";

export const chapters: Chapter[] = [
  ch01,
  ch02,
  ch03,
  ch04,
  ch05,
  ch06,
  ch07,
  ch08,
  ch09,
  ch10,
];

const allLessons: Lesson[] = chapters.flatMap((c) => c.lessons);
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

export const firstLessonId = chapters[0].lessons[0].id;
