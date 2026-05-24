import { Check, X } from "lucide-react";
import type { TestResult } from "./OutputPanel";

interface Props {
  testResults: TestResult[] | null;
  tsErrors: { message: string; line: number }[];
}

export function TestsPanel({ testResults, tsErrors }: Props) {
  return (
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
  );
}
