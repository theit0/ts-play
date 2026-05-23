import { useState, useCallback } from "react";
import type { ComponentProps } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Lesson } from "../data/types";
import { runCode } from "../utils/runner";
import { useAppStore } from "../store";

type CodeProps = ComponentProps<"code"> & { inline?: boolean };

interface TestResult {
  name: string;
  passed: boolean;
}

interface Props {
  lesson: Lesson;
}

export function ExerciseLesson({ lesson }: Props) {
  const {
    markComplete,
    completedLessons,
    saveCodeForLesson,
    getCodeForLesson,
  } = useAppStore();

  const savedCode = getCodeForLesson(lesson.id);
  const [code, setCode] = useState(savedCode ?? lesson.starterCode ?? "");
  const [output, setOutput] = useState<string[]>([]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<"tests" | "console">("tests");

  const isDone = completedLessons.has(lesson.id);

  const handleRun = useCallback(() => {
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

      const allPassed = results.every((r) => r.passed);
      if (allPassed) {
        markComplete(lesson.id);
      }
    } else {
      setActiveBottomTab("console");
    }
  }, [code, lesson, markComplete]);

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const v = value ?? "";
      setCode(v);
      saveCodeForLesson(lesson.id, v);
    },
    [lesson.id, saveCodeForLesson]
  );

  const handleShowSolution = () => {
    if (lesson.solution) {
      setCode(lesson.solution);
    }
  };

  const handleReset = () => {
    setCode(lesson.starterCode ?? "");
    setTestResults(null);
    setOutput([]);
    setRuntimeError(null);
  };

  const passedCount = testResults?.filter((r) => r.passed).length ?? 0;
  const totalCount = testResults?.length ?? 0;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Main area: editor + instructions */}
      <div className="flex flex-1 min-h-0">
        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#2a2a45]">
          <div className="flex items-center px-3 py-1.5 bg-[#141428] border-b border-[#2a2a45] text-xs text-[#6b7280] gap-2">
            <span className="text-[#e8e8f0]">index.ts</span>
            {isDone && (
              <span className="ml-auto text-[#f59e0b] flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 3L5 8.5 2 5.5"/>
                </svg>
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
              options={{
                fontSize: 14,
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

        {/* Instructions panel */}
        <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col overflow-hidden">
          <div className="flex border-b border-[#2a2a45]">
            <button className="px-4 py-2 text-sm text-[#e8e8f0] border-b-2 border-[#00d4aa] bg-transparent">
              Instrucciones
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold text-[#e8e8f0] mb-3">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-[#c5c5d8] leading-relaxed mb-3">
                    {children}
                  </p>
                ),
                code: ({ className, children, inline, ...props }: CodeProps) => {
                  const match = /language-(\w+)/.exec(className ?? "");
                  const lang = match?.[1] ?? "typescript";
                  if (!inline && match) {
                    return (
                      <div className="my-2 rounded overflow-hidden border border-[#2a2a45]">
                        <SyntaxHighlighter
                          language={lang === "ts" ? "typescript" : lang}
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            padding: "10px 12px",
                            background: "#0e0e1a",
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
                      className="bg-[#1e1e38] text-[#00d4aa] text-xs px-1 py-0.5 rounded font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                ul: ({ children }) => (
                  <ul className="text-sm text-[#c5c5d8] mb-3 space-y-1 ml-3 list-disc">
                    {children}
                  </ul>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => (
                  <strong className="text-[#e8e8f0] font-semibold">{children}</strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#00d4aa] pl-3 my-3 text-[#9ca3af] text-sm italic">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 rounded border border-[#2a2a45]">
                    <table className="w-full text-xs border-collapse">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-[#141428]">{children}</thead>,
                tbody: ({ children }) => <tbody className="divide-y divide-[#2a2a45]">{children}</tbody>,
                tr: ({ children }) => <tr>{children}</tr>,
                th: ({ children }) => (
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[#9ca3af] uppercase tracking-wider border-b border-[#2a2a45]">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-[#c5c5d8]">{children}</td>
                ),
              }}
            >
              {lesson.instructions || ""}
            </ReactMarkdown>

            {showHint && lesson.hint && (
              <div className="mt-3 p-3 bg-[#1e1e38] rounded border border-[#2a2a45] text-sm text-[#c5c5d8]">
                <span className="text-[#f59e0b] font-medium">Pista: </span>
                {lesson.hint}
              </div>
            )}

            {allPassed && (
              <div className="mt-4 p-3 bg-[#0d2a1a] rounded border border-[#065f46] text-sm text-[#6ee7b7]">
                🎉 ¡Todos los tests pasan! Ejercicio completado.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom panel: tests + console */}
      <div className="h-52 flex-shrink-0 border-t border-[#2a2a45] flex flex-col">
        <div className="flex items-center border-b border-[#2a2a45]">
          <button
            onClick={() => setActiveBottomTab("tests")}
            className={`px-4 py-2 text-sm transition-colors ${
              activeBottomTab === "tests"
                ? "text-[#e8e8f0] border-b-2 border-[#00d4aa]"
                : "text-[#6b7280] hover:text-[#9ca3af]"
            }`}
          >
            Tests{" "}
            {testResults && (
              <span className={`ml-1 text-xs font-medium ${allPassed ? "text-[#22c55e]" : "text-[#9ca3af]"}`}>
                ({passedCount}/{totalCount})
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveBottomTab("console")}
            className={`px-4 py-2 text-sm transition-colors ${
              activeBottomTab === "console"
                ? "text-[#e8e8f0] border-b-2 border-[#00d4aa]"
                : "text-[#6b7280] hover:text-[#9ca3af]"
            }`}
          >
            Consola
          </button>

          <div className="ml-auto flex items-center gap-2 px-3">
            {lesson.hint && !showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors"
              >
                Obtener pista
              </button>
            )}
            <button
              onClick={handleReset}
              className="text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors"
            >
              Reiniciar
            </button>
            {lesson.solution && (
              <button
                onClick={handleShowSolution}
                className="px-3 py-1 text-xs rounded bg-[#1e1e38] text-[#9ca3af] hover:text-[#e8e8f0] transition-colors"
              >
                Solución
              </button>
            )}
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 text-xs rounded bg-[#00d4aa] text-[#0e0e1a] font-semibold hover:bg-[#00c49a] transition-colors"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                <path d="M2 2l8 4-8 4V2z"/>
              </svg>
              Run
              <span className="text-[#0e0e1a]/60 text-[10px]">Ctrl+Enter</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {activeBottomTab === "tests" && (
            <div className="space-y-1">
              {testResults === null ? (
                <p className="text-xs text-[#6b7280] italic py-2">
                  Haz clic en Run para ejecutar los tests.
                </p>
              ) : (
                testResults.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm py-0.5">
                    <span className={t.passed ? "text-[#22c55e]" : "text-[#ef4444]"}>
                      {t.passed ? "✓" : "✗"}
                    </span>
                    <span className={t.passed ? "text-[#c5c5d8]" : "text-[#ef4444]"}>
                      {t.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeBottomTab === "console" && (
            <div className="font-mono text-xs space-y-0.5">
              {runtimeError && (
                <div className="text-[#ef4444]">{runtimeError}</div>
              )}
              {output.length === 0 && !runtimeError && (
                <p className="text-[#6b7280] italic">Sin salida todavía.</p>
              )}
              {output.map((line, i) => (
                <div key={i} className="text-[#f59e0b]">
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
