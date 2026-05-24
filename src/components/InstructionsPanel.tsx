import type { CSSProperties } from "react";
import { MarkdownContent } from "./MarkdownContent";

interface Props {
  instructions: string;
  hint?: string;
  showHint: boolean;
  allPassed: boolean;
  style?: CSSProperties;
  className?: string;
}

export function InstructionsPanel({ instructions, hint, showHint, allPassed, style, className = "" }: Props) {
  return (
    <div className={`flex-col overflow-hidden flex-shrink-0 ${className}`} style={style}>
      <div className="flex border-b border-[var(--vs-border)]">
        <button className="px-4 py-2 text-sm text-[var(--vs-fg)] border-b-2 border-[var(--vs-accent)] bg-transparent">
          Instrucciones
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <MarkdownContent content={instructions} compact />
        {showHint && hint && (
          <div className="mt-3 p-3 bg-[var(--vs-elevated)] rounded border border-[var(--vs-border)] text-sm text-[var(--vs-body)]">
            {hint}
          </div>
        )}
        {allPassed && (
          <div className="mt-4 p-3 bg-[var(--vs-success-bg)] rounded border border-[var(--vs-success-ring)] text-sm text-[var(--vs-success)]">
            ¡Todos los tests pasan! Ejercicio completado.
          </div>
        )}
      </div>
    </div>
  );
}
