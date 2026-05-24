import { Check, X, Play, ChevronRight } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { TabButton } from "./TabButton";
import type { Lesson } from "../data/types";

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export type BottomTab = "tests" | "console" | "js";

interface Props {
  height: number;
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  testResults: TestResult[] | null;
  tsErrors: { message: string; line: number }[];
  output: string[];
  runtimeError: string | null;
  compiledJs: { js: string; error?: string };
  babelReady: boolean;
  isRunning: boolean;
  allPassed: boolean;
  isDone: boolean;
  nextLesson: Lesson | null;
  isNavigating: boolean;
  hasHint: boolean;
  showHint: boolean;
  hasSolution: boolean;
  onRun: () => void;
  onReset: () => void;
  onShowHint: () => void;
  onShowSolution: () => void;
  onNavigateNext: () => void;
}

export function OutputPanel({
  height,
  activeTab,
  onTabChange,
  testResults,
  tsErrors,
  output,
  runtimeError,
  compiledJs,
  babelReady,
  isRunning,
  allPassed,
  isDone,
  nextLesson,
  isNavigating,
  hasHint,
  showHint,
  hasSolution,
  onRun,
  onReset,
  onShowHint,
  onShowSolution,
  onNavigateNext,
}: Props) {
  const passedCount = testResults?.filter((r) => r.passed).length ?? 0;
  const totalCount  = testResults?.length ?? 0;

  return (
    <div className="flex-shrink-0 flex flex-col" style={{ height }}>
      <div className="flex items-center border-b border-[var(--vs-border)] overflow-x-auto">
        <TabButton label="Tests" active={activeTab === "tests"} onClick={() => onTabChange("tests")}>
          {testResults && (
            <span className={`ml-1 text-xs font-medium ${allPassed ? "text-[var(--vs-success)]" : "text-[var(--vs-subtle)]"}`}>
              ({passedCount}/{totalCount})
            </span>
          )}
          {tsErrors.length > 0 && (
            <span className="ml-1 text-xs font-medium text-[var(--vs-error)]">TS:{tsErrors.length}</span>
          )}
        </TabButton>
        <TabButton label="Consola" active={activeTab === "console"} onClick={() => onTabChange("console")} />
        <TabButton label="JS"      active={activeTab === "js"}      onClick={() => onTabChange("js")} />

        <div className="ml-auto flex items-center gap-1.5 px-2 flex-shrink-0">
          {hasHint && !showHint && (
            <button onClick={onShowHint} className="px-2.5 py-1 text-xs rounded bg-[var(--vs-elevated)] text-[var(--vs-subtle)] hover:text-[var(--vs-fg)] transition-colors whitespace-nowrap">
              Pista
            </button>
          )}
          <button onClick={onReset} className="px-2.5 py-1 text-xs rounded bg-[var(--vs-elevated)] text-[var(--vs-subtle)] hover:text-[var(--vs-fg)] transition-colors whitespace-nowrap">
            Reiniciar
          </button>
          {hasSolution && (
            <button onClick={onShowSolution} className="px-2.5 py-1 text-xs rounded bg-[var(--vs-elevated)] text-[var(--vs-subtle)] hover:text-[var(--vs-fg)] transition-colors whitespace-nowrap">
              Solución
            </button>
          )}
          <button
            onClick={onRun}
            disabled={!babelReady || isRunning}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-[var(--vs-accent)] text-white font-semibold hover:bg-[var(--vs-accent-dark)] disabled:opacity-50 disabled:cursor-wait transition-colors whitespace-nowrap"
          >
            {isRunning
              ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <Play className="w-3 h-3" fill="currentColor" />}
            {!babelReady ? "Cargando..." : isRunning ? "Ejecutando..." : "Run"}
            {babelReady && !isRunning && <span className="text-white/60 text-[10px] hidden sm:inline">Ctrl+Enter</span>}
          </button>
          {(allPassed || isDone) && nextLesson && (
            <button
              onClick={onNavigateNext}
              disabled={isNavigating}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-[var(--vs-accent)] text-white font-semibold hover:bg-[var(--vs-accent-dark)] disabled:opacity-75 disabled:cursor-wait transition-colors whitespace-nowrap"
            >
              {isNavigating
                ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <>Siguiente<ChevronRight className="w-3 h-3" /></>}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {activeTab === "tests" && (
          <div className="space-y-1">
            {testResults === null && tsErrors.length === 0 ? (
              <p className="text-xs text-[var(--vs-muted)] py-2">Haz clic en Run para ejecutar los tests.</p>
            ) : (
              <>
                {tsErrors.map((e, i) => (
                  <div key={`ts-${i}`} className="flex items-start gap-2 py-0.5">
                    <span className="text-[var(--vs-error)] flex-shrink-0 mt-0.5"><X className="w-3.5 h-3.5" /></span>
                    <span className="text-[var(--vs-error)] font-mono text-xs leading-relaxed">
                      {e.line > 0 ? `L${e.line}: ` : ""}{e.message}
                    </span>
                  </div>
                ))}
                {testResults?.map((t, i) => (
                  <div key={i} className="flex flex-col py-0.5">
                    <div className="flex items-center gap-2 text-sm">
                      <span className={t.passed ? "text-[var(--vs-success)]" : "text-[var(--vs-error)]"}>
                        {t.passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </span>
                      <span className={t.passed ? "text-[var(--vs-body)]" : "text-[var(--vs-error)]"}>{t.name}</span>
                    </div>
                    {!t.passed && t.error && (
                      <div className="ml-6 font-mono text-xs text-[var(--vs-error)] opacity-70">{t.error}</div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === "console" && (
          <div className="font-mono text-xs space-y-0.5">
            {runtimeError && <div className="text-[var(--vs-error)]">{runtimeError}</div>}
            {output.length === 0 && !runtimeError && (
              <p className="text-[var(--vs-muted)] italic">Sin salida todavía.</p>
            )}
            {output.map((line, i) => <div key={i} className="text-[var(--vs-warn)]">{line}</div>)}
          </div>
        )}

        {activeTab === "js" && (
          <div className="h-full -mx-4 -my-2">
            {compiledJs.error ? (
              <div className="px-4 py-2 font-mono text-xs text-[var(--vs-error)]">{compiledJs.error}</div>
            ) : (
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: "8px 16px", background: "transparent", fontSize: "12px", lineHeight: "1.6", height: "100%", overflow: "auto" }}
                codeTagProps={{ style: { fontFamily: "'JetBrains Mono', Consolas, monospace" } }}
              >
                {compiledJs.js}
              </SyntaxHighlighter>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
