import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { Check, X, Play, ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";
import confetti from "canvas-confetti";
import Editor, { type OnMount, type Monaco } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import type { Lesson } from "../data/types";
import { getAdjacentLessons } from "../data/curriculum";
import { runCode, transpileToJs, isBabelReady, preloadBabel } from "../utils/runner";
import { useDragResize } from "../hooks/useDragResize";
import { useAppStore } from "../store";
import { useNavigate } from "react-router-dom";

SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);

type CodeProps = ComponentProps<"code"> & { inline?: boolean };

interface TestResult {
  name: string;
  passed: boolean;
}

interface Props {
  lesson: Lesson;
}

function playSuccess() {
  const ctx = new AudioContext();
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.connect(gain);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.2);
  });
}

export function ExerciseLesson({ lesson }: Props) {
  const navigate = useNavigate();
  const {
    markComplete,
    unmarkComplete,
    completedLessons,
    saveCodeForLesson,
    getCodeForLesson,
  } = useAppStore();

  const { next } = getAdjacentLessons(lesson.id);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const { size: bottomHeight, onMouseDown: onBottomDragStart } = useDragResize(208, "vertical", 80, 500);
  const { size: rightWidth, onMouseDown: onRightDragStart } = useDragResize(320, "horizontal", 200, 600);

  const savedCode = getCodeForLesson(lesson.id);
  const [code, setCode] = useState(savedCode ?? lesson.starterCode ?? "");
  const [output, setOutput] = useState<string[]>([]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [tsErrors, setTsErrors] = useState<{ message: string; line: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<"tests" | "console" | "js">("tests");
  const [mobilePanelTab, setMobilePanelTab] = useState<"editor" | "instructions">("editor");
  const [babelReady, setBabelReady] = useState(isBabelReady());

  useEffect(() => {
    if (!babelReady) {
      preloadBabel().then(() => setBabelReady(true));
    }
  }, []); // intentionally empty — run once on mount

  const isDone = completedLessons.has(lesson.id);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    let tsErrs: { message: string; line: number }[] = [];
    const monaco = monacoRef.current;
    const editor = editorRef.current;
    if (monaco && editor) {
      const model = editor.getModel();
      if (model) {
        await new Promise<void>((r) => setTimeout(r, 300));
        const markers: MonacoEditor.IMarker[] = monaco.editor.getModelMarkers({ resource: model.uri });
        tsErrs = markers
          .filter((m: MonacoEditor.IMarker) => m.severity === monaco.MarkerSeverity.Error)
          .map((m: MonacoEditor.IMarker) => ({ message: m.message, line: m.startLineNumber }));
      }
    }
    setTsErrors(tsErrs);

    const { output: out, error } = runCode(code);
    setOutput(out);
    setRuntimeError(error ?? null);

    if (lesson.tests && lesson.tests.length > 0) {
      const results = lesson.tests.map((t) => {
        try {
          return { name: t.name, passed: t.run(code) };
        } catch {
          return { name: t.name, passed: false };
        }
      });
      setTestResults(results);
      setActiveBottomTab("tests");

      const allTestsPassed = results.every((r) => r.passed) && tsErrs.length === 0;
      if (allTestsPassed) {
        markComplete(lesson.id);
        playSuccess();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    } else if (tsErrs.length > 0) {
      setActiveBottomTab("tests");
    } else {
      setActiveBottomTab("console");
    }
    setIsRunning(false);
  }, [code, lesson, markComplete]);

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const v = value ?? "";
      setCode(v);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveCodeForLesson(lesson.id, v);
      }, 500);
    },
    [lesson.id, saveCodeForLesson]
  );

  const handleShowSolution = () => {
    if (lesson.solution) setCode(lesson.solution);
  };

  const handleReset = () => {
    setCode(lesson.starterCode ?? "");
    setTestResults(null);
    setTsErrors([]);
    setOutput([]);
    setRuntimeError(null);
    unmarkComplete(lesson.id);
  };

  const handleMobilePanelTab = (tab: "editor" | "instructions") => {
    setMobilePanelTab(tab);
    if (tab === "editor") {
      setTimeout(() => editorRef.current?.layout(), 50);
    }
  };

  const compiledJs = useMemo(() => {
    if (!babelReady) return { js: "", error: undefined };
    return transpileToJs(code);
  }, [code, babelReady]);

  const passedCount = testResults?.filter((r) => r.passed).length ?? 0;
  const totalCount = testResults?.length ?? 0;
  const allPassed = totalCount > 0 && passedCount === totalCount && tsErrors.length === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Mobile tab switcher */}
      <div className="flex md:hidden flex-shrink-0 border-b border-[var(--vs-border)] bg-[var(--vs-surface)]">
        <button
          onClick={() => handleMobilePanelTab("editor")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mobilePanelTab === "editor"
              ? "text-[var(--vs-fg)] border-b-2 border-[var(--vs-accent)]"
              : "text-[var(--vs-muted)] hover:text-[var(--vs-subtle)]"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => handleMobilePanelTab("instructions")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mobilePanelTab === "instructions"
              ? "text-[var(--vs-fg)] border-b-2 border-[var(--vs-accent)]"
              : "text-[var(--vs-muted)] hover:text-[var(--vs-subtle)]"
          }`}
        >
          Instrucciones
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Editor */}
        <div
          className={`flex-col min-w-0 flex-1 ${
            mobilePanelTab === "instructions" ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex items-center px-3 py-1.5 bg-[var(--vs-surface)] border-b border-[var(--vs-border)] text-xs text-[var(--vs-muted)] gap-2">
            <span className="text-[var(--vs-fg)]">index.ts</span>
            {isDone && (
              <span className="ml-auto text-[var(--vs-success)] flex items-center gap-1">
                <Check className="w-3 h-3" />
                Completado
              </span>
            )}
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                monacoRef.current = monaco;
              }}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "line",
                tabSize: 4,
                insertSpaces: true,
                wordWrap: "off",
                padding: { top: 12, bottom: 12 },
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontLigatures: true,
              }}
            />
          </div>
        </div>

        {/* Right-panel resize handle */}
        <div
          onMouseDown={onRightDragStart}
          className="w-1 flex-shrink-0 self-stretch cursor-col-resize bg-[var(--vs-border)] hover:bg-[var(--vs-accent)] transition-colors hidden md:block"
        />

        {/* Instructions panel */}
        <div
          className={`flex-col overflow-hidden flex-shrink-0 ${
            mobilePanelTab === "editor" ? "hidden md:flex" : "flex w-full"
          }`}
          style={{ width: rightWidth }}
        >
          <div className="flex border-b border-[var(--vs-border)]">
            <button className="px-4 py-2 text-sm text-[var(--vs-fg)] border-b-2 border-[var(--vs-accent)] bg-transparent">
              Instrucciones
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold text-[var(--vs-fg)] mb-3">{children}</h2>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-[var(--vs-body)] leading-relaxed mb-3">{children}</p>
                ),
                code: ({ className, children, inline, ...props }: CodeProps) => {
                  const match = /language-(\w+)/.exec(className ?? "");
                  const lang = match?.[1] ?? "typescript";
                  if (!inline && match) {
                    return (
                      <div className="my-2 rounded overflow-hidden border border-[var(--vs-border)]">
                        <SyntaxHighlighter
                          language={lang === "ts" ? "typescript" : lang}
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: "10px 12px",
                            background: "#1e1e1e",
                            fontSize: "12px",
                            lineHeight: "1.6",
                          }}
                          codeTagProps={{ style: { fontFamily: "'JetBrains Mono', Consolas, monospace" } }}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                  return (
                    <code
                      className="bg-[var(--vs-elevated)] text-[var(--vs-accent)] text-xs px-1 py-0.5 rounded font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                ul: ({ children }) => (
                  <ul className="text-sm text-[var(--vs-body)] mb-3 space-y-1 ml-3 list-disc">{children}</ul>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => (
                  <strong className="text-[var(--vs-fg)] font-semibold">{children}</strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[var(--vs-accent)] pl-3 my-3 text-[var(--vs-subtle)] text-sm italic">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 rounded border border-[var(--vs-border)]">
                    <table className="w-full text-xs border-collapse">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-[var(--vs-surface)]">{children}</thead>,
                tbody: ({ children }) => <tbody className="divide-y divide-[var(--vs-border)]">{children}</tbody>,
                tr: ({ children }) => <tr>{children}</tr>,
                th: ({ children }) => (
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--vs-subtle)] uppercase tracking-wider border-b border-[var(--vs-border)]">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-[var(--vs-body)]">{children}</td>
                ),
              }}
            >
              {lesson.instructions || ""}
            </ReactMarkdown>

            {showHint && lesson.hint && (
              <div className="mt-3 p-3 bg-[var(--vs-elevated)] rounded border border-[var(--vs-border)] text-sm text-[var(--vs-body)]">
                {lesson.hint}
              </div>
            )}

            {allPassed && (
              <div className="mt-4 p-3 bg-[var(--vs-success-bg)] rounded border border-[var(--vs-success-ring)] text-sm text-[var(--vs-success)]">
                ¡Todos los tests pasan! Ejercicio completado.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom panel resize handle */}
      <div
        onMouseDown={onBottomDragStart}
        className="h-1 flex-shrink-0 cursor-row-resize bg-[var(--vs-border)] hover:bg-[var(--vs-accent)] transition-colors"
      />

      {/* Bottom panel: tests + console */}
      <div className="flex-shrink-0 flex flex-col" style={{ height: bottomHeight }}>
        <div className="flex items-center border-b border-[var(--vs-border)] overflow-x-auto">
          <button
            onClick={() => setActiveBottomTab("tests")}
            className={`flex-shrink-0 px-4 py-2 text-sm transition-colors ${
              activeBottomTab === "tests"
                ? "text-[var(--vs-fg)] border-b-2 border-[var(--vs-accent)]"
                : "text-[var(--vs-muted)] hover:text-[var(--vs-subtle)]"
            }`}
          >
            Tests{" "}
            {testResults && (
              <span
                className={`ml-1 text-xs font-medium ${
                  allPassed ? "text-[var(--vs-success)]" : "text-[var(--vs-subtle)]"
                }`}
              >
                ({passedCount}/{totalCount})
              </span>
            )}
            {tsErrors.length > 0 && (
              <span className="ml-1 text-xs font-medium text-[var(--vs-error)]">
                TS:{tsErrors.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveBottomTab("console")}
            className={`flex-shrink-0 px-4 py-2 text-sm transition-colors ${
              activeBottomTab === "console"
                ? "text-[var(--vs-fg)] border-b-2 border-[var(--vs-accent)]"
                : "text-[var(--vs-muted)] hover:text-[var(--vs-subtle)]"
            }`}
          >
            Consola
          </button>
          <button
            onClick={() => setActiveBottomTab("js")}
            className={`flex-shrink-0 px-4 py-2 text-sm transition-colors ${
              activeBottomTab === "js"
                ? "text-[var(--vs-fg)] border-b-2 border-[var(--vs-accent)]"
                : "text-[var(--vs-muted)] hover:text-[var(--vs-subtle)]"
            }`}
          >
            JS
          </button>

          <div className="ml-auto flex items-center gap-1.5 px-2 flex-shrink-0">
            {lesson.hint && !showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="px-2.5 py-1 text-xs rounded bg-[var(--vs-elevated)] text-[var(--vs-subtle)] hover:text-[var(--vs-fg)] transition-colors whitespace-nowrap"
              >
                Pista
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-2.5 py-1 text-xs rounded bg-[var(--vs-elevated)] text-[var(--vs-subtle)] hover:text-[var(--vs-fg)] transition-colors whitespace-nowrap"
            >
              Reiniciar
            </button>
            {lesson.solution && (
              <button
                onClick={handleShowSolution}
                className="px-2.5 py-1 text-xs rounded bg-[var(--vs-elevated)] text-[var(--vs-subtle)] hover:text-[var(--vs-fg)] transition-colors whitespace-nowrap"
              >
                Solución
              </button>
            )}
            <button
              onClick={handleRun}
              disabled={!babelReady || isRunning}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-[var(--vs-accent)] text-white font-semibold hover:bg-[var(--vs-accent-dark)] disabled:opacity-50 disabled:cursor-wait transition-colors whitespace-nowrap"
            >
              {isRunning ? (
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Play className="w-3 h-3" fill="currentColor" />
              )}
              {!babelReady ? "Cargando..." : isRunning ? "Ejecutando..." : "Run"}
              {babelReady && !isRunning && <span className="text-white/60 text-[10px] hidden sm:inline">Ctrl+Enter</span>}
            </button>
            {(allPassed || isDone) && next && (
              <button
                onClick={() => {
                  setIsNavigating(true);
                  navigate(`/lesson/${next.id}`);
                }}
                disabled={isNavigating}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-[var(--vs-accent)] text-white font-semibold hover:bg-[var(--vs-accent-dark)] disabled:opacity-75 disabled:cursor-wait transition-colors whitespace-nowrap"
              >
                {isNavigating ? (
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Siguiente
                    <ChevronRight className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {activeBottomTab === "tests" && (
            <div className="space-y-1">
              {testResults === null && tsErrors.length === 0 ? (
                <p className="text-xs text-[var(--vs-muted)] py-2">
                  Haz clic en Run para ejecutar los tests.
                </p>
              ) : (
                <>
                  {tsErrors.map((e, i) => (
                    <div key={`ts-${i}`} className="flex items-start gap-2 py-0.5">
                      <span className="text-[var(--vs-error)] flex-shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[var(--vs-error)] font-mono text-xs leading-relaxed">
                        {e.line > 0 ? `L${e.line}: ` : ""}
                        {e.message}
                      </span>
                    </div>
                  ))}
                  {testResults?.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm py-0.5">
                      <span className={t.passed ? "text-[var(--vs-success)]" : "text-[var(--vs-error)]"}>
                        {t.passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </span>
                      <span className={t.passed ? "text-[var(--vs-body)]" : "text-[var(--vs-error)]"}>
                        {t.name}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeBottomTab === "console" && (
            <div className="font-mono text-xs space-y-0.5">
              {runtimeError && (
                <div className="text-[var(--vs-error)]">{runtimeError}</div>
              )}
              {output.length === 0 && !runtimeError && (
                <p className="text-[var(--vs-muted)] italic">Sin salida todavía.</p>
              )}
              {output.map((line, i) => (
                <div key={i} className="text-[var(--vs-warn)]">{line}</div>
              ))}
            </div>
          )}

          {activeBottomTab === "js" && (
            <div className="h-full -mx-4 -my-2">
              {compiledJs.error ? (
                <div className="px-4 py-2 font-mono text-xs text-[var(--vs-error)]">
                  {compiledJs.error}
                </div>
              ) : (
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: "8px 16px",
                    background: "transparent",
                    fontSize: "12px",
                    lineHeight: "1.6",
                    height: "100%",
                    overflow: "auto",
                  }}
                  codeTagProps={{ style: { fontFamily: "'JetBrains Mono', Consolas, monospace" } }}
                >
                  {compiledJs.js}
                </SyntaxHighlighter>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
