import { create } from "zustand";

const PROGRESS_KEY = "ts-play-progress";
const CODE_KEY = "ts-play-code";

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
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]));
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

function saveCode(codes: Record<string, string>): void {
  localStorage.setItem(CODE_KEY, JSON.stringify(codes));
}

interface AppState {
  completedLessons: Set<string>;
  savedCode: Record<string, string>;
  sidebarOpen: boolean;

  markComplete: (id: string) => void;
  unmarkComplete: (id: string) => void;
  saveCodeForLesson: (lessonId: string, code: string) => void;
  getCodeForLesson: (lessonId: string) => string | undefined;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  completedLessons: loadProgress(),
  savedCode: loadCode(),
  sidebarOpen: typeof window !== "undefined" ? window.innerWidth >= 768 : true,

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
}));
