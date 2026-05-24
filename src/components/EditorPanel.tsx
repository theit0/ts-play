import { Check } from "lucide-react";
import Editor, { type OnMount } from "@monaco-editor/react";

interface Props {
  code: string;
  onChange: (value: string | undefined) => void;
  onMount: OnMount;
  isDone: boolean;
  className?: string;
}

export function EditorPanel({ code, onChange, onMount, isDone, className = "" }: Props) {
  return (
    <div className={`flex-col min-w-0 flex-1 ${className}`}>
      <div className="flex items-center px-3 py-1.5 bg-[var(--vs-surface)] border-b border-[var(--vs-border)] text-xs text-[var(--vs-muted)] gap-2">
        <span className="text-[var(--vs-fg)]">index.ts</span>
        {isDone && (
          <span className="ml-auto text-[var(--vs-success)] flex items-center gap-1">
            <Check className="w-3 h-3" /> Completado
          </span>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={code}
          onChange={onChange}
          theme="vs-dark"
          onMount={onMount}
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
          mouseWheelZoom: true,
          }}
        />
      </div>
    </div>
  );
}
