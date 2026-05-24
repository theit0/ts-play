import { Play, ChevronRight } from "lucide-react";
import { TabButton } from "./TabButton";
import { TestsPanel } from "./TestsPanel";
import { ConsolePanel } from "./ConsolePanel";
import { JsPreviewPanel } from "./JsPreviewPanel";
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
        {activeTab === "tests"   && <TestsPanel testResults={testResults} tsErrors={tsErrors} />}
        {activeTab === "console" && <ConsolePanel output={output} runtimeError={runtimeError} />}
        {activeTab === "js"      && <JsPreviewPanel compiledJs={compiledJs} />}
      </div>
    </div>
  );
}
