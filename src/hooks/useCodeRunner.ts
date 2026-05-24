import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import confetti from "canvas-confetti";
import type { OnMount, Monaco } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import type { Lesson } from "../data/types";
import { runCode, transpileToJs, isBabelReady, preloadBabel } from "../utils/runner";
import { useAppStore } from "../store";
import { playSuccess } from "../utils/audio";
import type { BottomTab, TestResult } from "../components/OutputPanel";

export function useCodeRunner(lesson: Lesson, code: string) {
  const { markComplete, completedLessons } = useAppStore();
  const isDone = completedLessons.has(lesson.id);

  const editorRef    = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef    = useRef<Monaco | null>(null);
  const handleRunRef = useRef<() => void>(() => {});

  const [output,          setOutput         ] = useState<string[]>([]);
  const [runtimeError,    setRuntimeError   ] = useState<string | null>(null);
  const [testResults,     setTestResults    ] = useState<TestResult[] | null>(null);
  const [tsErrors,        setTsErrors       ] = useState<{ message: string; line: number }[]>([]);
  const [isRunning,       setIsRunning      ] = useState(false);
  const [babelReady,      setBabelReady     ] = useState(isBabelReady());
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTab>("tests");

  useEffect(() => {
    if (!babelReady) preloadBabel().then(() => setBabelReady(true));
  }, []); // intentionally empty - run once on mount

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
            message:
              typeof d.messageText === "string"
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
        catch (e) { return { name: t.name, passed: false, error: e instanceof Error ? e.message : String(e) }; }
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

  const resetRunnerState = useCallback(() => {
    setTestResults(null);
    setTsErrors([]);
    setOutput([]);
    setRuntimeError(null);
  }, []);

  return {
    editorRef,
    isDone,
    output, runtimeError, testResults, tsErrors, isRunning, babelReady,
    activeBottomTab, setActiveBottomTab,
    handleRun, handleEditorMount,
    compiledJs, allPassed,
    resetRunnerState,
  };
}
