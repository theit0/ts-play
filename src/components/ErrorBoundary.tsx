import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;

    if (error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[var(--vs-bg)] text-[var(--vs-fg)] p-8">
          <AlertTriangle className="w-10 h-10 text-[var(--vs-error)]" />
          <div className="text-center">
            <p className="font-semibold text-[var(--vs-fg)] mb-1">Algo salió mal</p>
            <p className="text-xs text-[var(--vs-muted)] font-mono max-w-md break-all">
              {error.message}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={this.reset}
              className="px-3 py-1.5 text-xs rounded bg-[var(--vs-accent)] text-white hover:bg-[var(--vs-accent-dark)] transition-colors"
            >
              Reintentar
            </button>
            <a
              href="/"
              className="px-3 py-1.5 text-xs rounded bg-[var(--vs-elevated)] text-[var(--vs-subtle)] hover:text-[var(--vs-fg)] transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
