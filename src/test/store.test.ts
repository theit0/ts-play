// @vitest-environment jsdom
import { beforeEach, describe, it, expect } from "vitest";
import { useAppStore } from "../store";

const PROGRESS_KEY = "ts-play-progress-v1";
const CODE_KEY     = "ts-play-code-v1";
const LAST_KEY     = "ts-play-last-lesson-v1";

function resetStore() {
  useAppStore.setState({
    completedLessons: new Set<string>(),
    savedCode: {},
    lastLessonId: null,
  });
}

beforeEach(() => {
  localStorage.clear();
  resetStore();
});

describe("markComplete / unmarkComplete", () => {
  it("adds lesson to completedLessons", () => {
    useAppStore.getState().markComplete("ch01-01");
    expect(useAppStore.getState().completedLessons.has("ch01-01")).toBe(true);
  });

  it("persists to localStorage", () => {
    useAppStore.getState().markComplete("ch01-01");
    const raw = localStorage.getItem(PROGRESS_KEY);
    expect(JSON.parse(raw!)).toContain("ch01-01");
  });

  it("removes lesson from completedLessons", () => {
    useAppStore.getState().markComplete("ch01-01");
    useAppStore.getState().unmarkComplete("ch01-01");
    expect(useAppStore.getState().completedLessons.has("ch01-01")).toBe(false);
  });

  it("persists removal to localStorage", () => {
    useAppStore.getState().markComplete("ch01-01");
    useAppStore.getState().unmarkComplete("ch01-01");
    const raw = localStorage.getItem(PROGRESS_KEY);
    expect(JSON.parse(raw!)).not.toContain("ch01-01");
  });

  it("marking multiple lessons tracks each independently", () => {
    useAppStore.getState().markComplete("ch01-01");
    useAppStore.getState().markComplete("ch01-02");
    useAppStore.getState().unmarkComplete("ch01-01");
    const { completedLessons } = useAppStore.getState();
    expect(completedLessons.has("ch01-01")).toBe(false);
    expect(completedLessons.has("ch01-02")).toBe(true);
  });
});

describe("saveCodeForLesson / getCodeForLesson", () => {
  it("stores and retrieves code by lesson id", () => {
    useAppStore.getState().saveCodeForLesson("ch01-01", "const x = 1;");
    expect(useAppStore.getState().getCodeForLesson("ch01-01")).toBe("const x = 1;");
  });

  it("persists code to localStorage", () => {
    useAppStore.getState().saveCodeForLesson("ch01-01", "const x = 1;");
    const raw = localStorage.getItem(CODE_KEY);
    expect(JSON.parse(raw!)["ch01-01"]).toBe("const x = 1;");
  });

  it("returns undefined for unknown lesson id", () => {
    expect(useAppStore.getState().getCodeForLesson("nonexistent")).toBeUndefined();
  });

  it("overwrites existing code for same lesson id", () => {
    useAppStore.getState().saveCodeForLesson("ch01-01", "const x = 1;");
    useAppStore.getState().saveCodeForLesson("ch01-01", "const x = 42;");
    expect(useAppStore.getState().getCodeForLesson("ch01-01")).toBe("const x = 42;");
  });
});

describe("setLastLessonId", () => {
  it("updates state", () => {
    useAppStore.getState().setLastLessonId("ch03-05");
    expect(useAppStore.getState().lastLessonId).toBe("ch03-05");
  });

  it("persists to localStorage", () => {
    useAppStore.getState().setLastLessonId("ch03-05");
    expect(localStorage.getItem(LAST_KEY)).toBe("ch03-05");
  });
});

describe("toggleSidebar", () => {
  it("flips sidebarOpen", () => {
    const before = useAppStore.getState().sidebarOpen;
    useAppStore.getState().toggleSidebar();
    expect(useAppStore.getState().sidebarOpen).toBe(!before);
  });

  it("toggles back to original on double toggle", () => {
    const before = useAppStore.getState().sidebarOpen;
    useAppStore.getState().toggleSidebar();
    useAppStore.getState().toggleSidebar();
    expect(useAppStore.getState().sidebarOpen).toBe(before);
  });
});
