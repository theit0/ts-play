import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import confetti from "canvas-confetti";
import type { OnMount, Monaco } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import type { Lesson } from "../data/types";
import { getAdjacentLessons } from "../data/curriculum";
import { runCode, transpileToJs, isBabelReady, preloadBabel } from "../utils/runner";
import { useDragResize } from "../hooks/useDragResize";
import { useAppStore } from "../store";
import { useNavigate } from "react-router-dom";
import { playSuccess } from "../utils/audio";
import { TIMING } from "../config";
import { EditorPanel } from "./EditorPanel";
import { InstructionsPanel } from "./InstructionsPanel";
import { OutputPanel, type BottomTab, type TestResult } from "./OutputPanel";
import { TabButton } from "./TabButton";

type MobilePanel = "editor" | "instructions";

interface Props {
  lesson: Lesson;
}

export function ExerciseLesson({ lesson }: Props) {
  const navigate = useNavigate();
  const { markComplete, unmarkComplete, completedLessons, saveCodeForLesson, getCodeForLesson } = useAppStore();

  const { next } = getAdjacentLessons(lesson.id);
  const saveTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef    = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef    = useRef<Monaco | null>(null);
  const handleRunRef = useRef<() => void>(() => {});

  const { size: bottomHeight, onMouseDown: onBottomDragStart } = useDragResize(208, "vertical", 80, 500);
  const { size: rightWidth,   onMouseDown: onRightDragStart  } = useDragResize(320, "horizontal", 200, 600);

  const [code,             setCode            ] = useState(getCodeForLesson(lesson.id) ?? lesson.starterCode ?? "");
  const [output,           setOutput          ] = useState<string[]>([]);
  const [runtimeError,     setRuntimeError    ] = useState<string | null>(null);
  const [testResults,      setTestResults     ] = useState<TestResult[] | null>(null);
  const [tsErrors,         setTsErrors        ] = useState<{ message: string; line: number }[]>([]);
  const [isRunning,        setIsRunning       ] = useState(false);
  const [isNavigating,     setIsNavigating    ] = useState(false);
  const [showHint,         setShowHint        ] = useState(false);
  const [activeBottomTab,  setActiveBottomTab ] = useState<BottomTab>("tests");
  const [mobilePanelTab,   setMobilePanelTab  ] = useState<MobilePanel>("editor");
  const [babelReady,       setBabelReady      ] = useState(isBabelReady());

  useEffect(() => {
    if (!babelReady) preloadBabel().then(() => setBabelReady(true));
  }, []); // intentionally empty - run once on mount

  const isDone = completedLessons.has(lesson.id);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    let tsErrs: { message: string; line: number }[] = [];

    const monaco = monacoRef.current;
    const editor = editorRef.current;
    if (monaco && editor) {
      const model = editor.getModel();
      if (model) {
        try {
          const getWorker = await monaco.languages.typescript.getTypeScriptWorker();
          const tsWorker = await getWorker(model.uri);
          const uri = model.uri.toString();
          const [semantic, syntactic] = await Promise.all([
            tsWorker.getSemanticDiagnostics(uri),
            tsWorker.getSyntacticDiagnostics(uri),
          ]);
          tsErrs = [...semantic, ...syntactic].map((d) => ({
            message: typeof d.messageText === "string"
              ? d.messageText
              : (d.messageText as { messageText: string }).messageText,
            line: model.getPositionAt(d.start ?? 0).lineNumber,
          }));
        } catch {
          const markers: MonacoEditor.IMarker[] = monaco.editor.getModelMarkers({ resource: model.uri });
          tsErrs = markers
            .filter((m) => m.severity === monaco.MarkerSeverity.Error)
            .map((m) => ({ message: m.message, line: m.startLineNumber }));
        }
      }
    }
    setTsErrors(tsErrs);

    const { output: out, error } = runCode(code);
    setOutput(out);
    setRuntimeError(error ?? null);

    if (lesson.tests && lesson.tests.length > 0) {
      const results = lesson.tests.map((t) => {
        try   { return { name: t.name, passed: t.run(code) }; }
        catch { return { name: t.name, passed: false }; }
      });
      setTestResults(results);
      setActiveBottomTab("tests");

      if (results.every((r) => r.passed) && tsErrs.length === 0) {
        markComplete(lesson.id);
        playSuccess();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      setActiveBottomTab(tsErrs.length > 0 ? "tests" : "console");
    }
    setIsRunning(false);
  }, [code, lesson, markComplete]);

  handleRunRef.current = handleRun;

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
    setTestResults(null);
    setTsErrors([]);
    setOutput([]);
    setRuntimeError(null);
    unmarkComplete(lesson.id);
  };

  const handleMobilePanelTab = (tab: MobilePanel) => {
    setMobilePanelTab(tab);
    if (tab === "editor") setTimeout(() => editorRef.current?.layout(), TIMING.EDITOR_LAYOUT_DELAY);
  };

  const handleEditorMount = useCallback<OnMount>((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.addAction({
      id: "run-code",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => handleRunRef.current(),
    });
  }, []);

  const compiledJs = useMemo(
    () => (babelReady ? transpileToJs(code) : { js: "", error: undefined }),
    [code, babelReady]
  );

  const allPassed =
    (testResults?.length ?? 0) > 0 &&
    testResults?.every((r) => r.passed) === true &&
    tsErrors.length === 0;

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
        onNavigateNext={() => { setIsNavigating(true); navigate(`/lesson/${next!.id}`); }}
      />
    </div>
  );
}
