import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ErrorBoundary } from "./ErrorBoundary";
import { useAppStore } from "../store";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <div className="h-screen flex flex-col bg-[var(--vs-bg)] text-[var(--vs-fg)] overflow-hidden">
      <ErrorBoundary fallback={<div className="h-12 flex-shrink-0 border-b border-[var(--vs-border)]" />}>
        <Header />
      </ErrorBoundary>
      <div className="flex flex-1 min-h-0 relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        {sidebarOpen && (
          <aside className="fixed top-0 left-0 h-screen z-30 md:static md:h-auto md:z-auto w-64 flex-shrink-0 bg-[var(--vs-surface)] border-r border-[var(--vs-border)] flex flex-col">
            <ErrorBoundary fallback={null}>
              <Sidebar />
            </ErrorBoundary>
          </aside>
        )}
        {children}
      </div>
    </div>
  );
}
