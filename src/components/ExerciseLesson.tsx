import { useState, useCallback, useRef, useEffect } from "react";
import type { Lesson } from "../data/types";
import { getAdjacentLessons } from "../data/curriculum";
import { useDragResize } from "../hooks/useDragResize";
import { useCodeRunner } from "../hooks/useCodeRunner";
import { useAppStore } from "../store";
import { useNavigate } from "react-router-dom";
import { navigateTo } from "../utils/navigation";
import { TIMING } from "../config";
import { EditorPanel } from "./EditorPanel";
import { InstructionsPanel } from "./InstructionsPanel";
import { OutputPanel } from "./OutputPanel";
import { TabButton } from "./TabButton";

type MobilePanel = "editor" | "instructions";

interface Props {
  lesson: Lesson;
}

export function ExerciseLesson({ lesson }: Props) {
  const navigate = useNavigate();
  const { unmarkComplete, saveCodeForLesson, getCodeForLesson } = useAppStore();

  const { next } = getAdjacentLessons(lesson.id);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { size: bottomHeight, onMouseDown: onBottomDragStart } = useDragResize(208, "vertical", 80, 500);
  const { size: rightWidth,   onMouseDown: onRightDragStart  } = useDragResize(320, "horizontal", 200, 600);

  const [code,           setCode          ] = useState(getCodeForLesson(lesson.id) ?? lesson.starterCode ?? "");
  const [isNavigating,   setIsNavigating  ] = useState(false);
  const [showHint,       setShowHint      ] = useState(false);
  const [mobilePanelTab, setMobilePanelTab] = useState<MobilePanel>("editor");

  const {
    editorRef,
    isDone,
    output, runtimeError, testResults, tsErrors, isRunning, babelReady,
    activeBottomTab, setActiveBottomTab,
    handleRun, handleEditorMount,
    compiledJs, allPassed,
    resetRunnerState,
  } = useCodeRunner(lesson, code);

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const v = value ?? "";
      setCode(v);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveCodeForLesson(lesson.id, v), TIMING.CODE_SAVE_DEBOUNCE);
    },
    [lesson.id, saveCodeForLesson]
  );

  const handleReset = () => {
    setCode(lesson.starterCode ?? "");
    resetRunnerState();
    unmarkComplete(lesson.id);
  };

  const handleMobilePanelTab = (tab: MobilePanel) => {
    setMobilePanelTab(tab);
    if (tab === "editor") setTimeout(() => editorRef.current?.layout(), TIMING.EDITOR_LAYOUT_DELAY);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex md:hidden flex-shrink-0 border-b border-[var(--vs-border)] bg-[var(--vs-surface)]">
        <TabButton label="Editor"        active={mobilePanelTab === "editor"}       onClick={() => handleMobilePanelTab("editor")} />
        <TabButton label="Instrucciones" active={mobilePanelTab === "instructions"} onClick={() => handleMobilePanelTab("instructions")} />
      </div>

      <div className="flex flex-1 min-h-0">
        <EditorPanel
          code={code}
          onChange={handleCodeChange}
          onMount={handleEditorMount}
          isDone={isDone}
          className={mobilePanelTab === "instructions" ? "hidden md:flex" : "flex"}
        />

        <div
          onMouseDown={onRightDragStart}
          className="w-1 flex-shrink-0 self-stretch cursor-col-resize bg-[var(--vs-border)] hover:bg-[var(--vs-accent)] transition-colors hidden md:block"
        />

        <InstructionsPanel
          instructions={lesson.instructions ?? ""}
          hint={lesson.hint}
          showHint={showHint}
          allPassed={allPassed}
          style={{ width: rightWidth }}
          className={mobilePanelTab === "editor" ? "hidden md:flex" : "flex w-full"}
        />
      </div>

      <div
        onMouseDown={onBottomDragStart}
        className="h-1 flex-shrink-0 cursor-row-resize bg-[var(--vs-border)] hover:bg-[var(--vs-accent)] transition-colors"
      />

      <OutputPanel
        height={bottomHeight}
        activeTab={activeBottomTab}
        onTabChange={setActiveBottomTab}
        testResults={testResults}
        tsErrors={tsErrors}
        output={output}
        runtimeError={runtimeError}
        compiledJs={compiledJs}
        babelReady={babelReady}
        isRunning={isRunning}
        allPassed={allPassed}
        isDone={isDone}
        nextLesson={next}
        isNavigating={isNavigating}
        hasHint={!!lesson.hint}
        showHint={showHint}
        hasSolution={!!lesson.solution}
        onRun={handleRun}
        onReset={handleReset}
        onShowHint={() => setShowHint(true)}
        onShowSolution={() => lesson.solution && setCode(lesson.solution)}
        onNavigateNext={() => { setIsNavigating(true); navigateTo(navigate, next ? `/lesson/${next.id}` : "/"); }}
      />
    </div>
  );
}
