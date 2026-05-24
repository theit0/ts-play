export function TabButton({ label, active, onClick, children }: {
  label: string; active: boolean; onClick: () => void; children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 text-sm transition-colors ${
        active
          ? "text-[var(--vs-fg)] border-b-2 border-[var(--vs-accent)]"
          : "text-[var(--vs-muted)] hover:text-[var(--vs-subtle)]"
      }`}
    >
      {label}{children}
    </button>
  );
}
