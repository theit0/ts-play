interface Props {
  output: string[];
  runtimeError: string | null;
}

export function ConsolePanel({ output, runtimeError }: Props) {
  return (
    <div className="font-mono text-xs space-y-0.5">
      {runtimeError && <div className="text-[var(--vs-error)]">{runtimeError}</div>}
      {output.length === 0 && !runtimeError && (
        <p className="text-[var(--vs-muted)] italic">Sin salida todavía.</p>
      )}
      {output.map((line, i) => (
        <div key={i} className="text-[var(--vs-warn)]">{line}</div>
      ))}
    </div>
  );
}
