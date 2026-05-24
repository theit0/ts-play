import { create } from "zustand";

const PROGRESS_KEY = "ts-play-progress-v1";
const CODE_KEY = "ts-play-code-v1";
const LAST_LESSON_KEY = "ts-play-last-lesson-v1";

function loadProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    // ignore
  }
  return new Set();
}

function saveProgress(completed: Set<string>): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

function loadCode(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CODE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, string>;
  } catch {
    // ignore
  }
  return {};
}

function loadLastLessonId(): string | null {
  try {
    return localStorage.getItem(LAST_LESSON_KEY);
  } catch {
    return null;
  }
}

function saveCode(codes: Record<string, string>): void {
  try {
    localStorage.setItem(CODE_KEY, JSON.stringify(codes));
  } catch (e) {
    console.error("Failed to save code:", e);
  }
}

interface AppState {
  completedLessons: Set<string>;
  savedCode: Record<string, string>;
  sidebarOpen: boolean;
  lastLessonId: string | null;

  markComplete: (id: string) => void;
  unmarkComplete: (id: string) => void;
  saveCodeForLesson: (lessonId: string, code: string) => void;
  getCodeForLesson: (lessonId: string) => string | undefined;
  toggleSidebar: () => void;
  setLastLessonId: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  completedLessons: loadProgress(),
  savedCode: loadCode(),
  sidebarOpen: typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  lastLessonId: loadLastLessonId(),

  markComplete: (id) => {
    const next = new Set(get().completedLessons);
    next.add(id);
    saveProgress(next);
    set({ completedLessons: next });
  },

  unmarkComplete: (id) => {
    const next = new Set(get().completedLessons);
    next.delete(id);
    saveProgress(next);
    set({ completedLessons: next });
  },

  saveCodeForLesson: (lessonId, code) => {
    const next = { ...get().savedCode, [lessonId]: code };
    saveCode(next);
    set({ savedCode: next });
  },

  getCodeForLesson: (lessonId) => get().savedCode[lessonId],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setLastLessonId: (id) => {
    try {
      localStorage.setItem(LAST_LESSON_KEY, id);
    } catch (e) {
      console.error("Failed to save last lesson:", e);
    }
    set({ lastLessonId: id });
  },
}));
