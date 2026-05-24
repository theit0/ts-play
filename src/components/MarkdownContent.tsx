import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import type { ComponentProps } from "react";

SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);

type CodeProps = ComponentProps<"code"> & { inline?: boolean };

const MONO = { fontFamily: "'JetBrains Mono', Consolas, monospace" };

function buildComponents(compact: boolean) {
  return {
    ...(!compact && {
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-2xl font-bold text-[var(--vs-fg)] mb-6 pb-3 border-b border-[var(--vs-border)]">
          {children}
        </h1>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-base font-semibold text-[var(--vs-fg)] mt-6 mb-2">{children}</h3>
      ),
      ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="text-[var(--vs-body)] mb-4 space-y-1 ml-4 list-decimal">{children}</ol>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <em className="text-[var(--vs-body)] italic">{children}</em>
      ),
      tr: ({ children }: { children?: React.ReactNode }) => (
        <tr className="hover:bg-[var(--vs-elevated)] transition-colors">{children}</tr>
      ),
      hr: () => <hr className="border-[var(--vs-border)] my-6" />,
    }),

    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className={`font-semibold text-[var(--vs-fg)] ${compact ? "text-base mb-3" : "text-lg mt-8 mb-3"}`}>
        {children}
      </h2>
    ),
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className={`text-[var(--vs-body)] leading-relaxed ${compact ? "text-sm mb-3" : "mb-4"}`}>{children}</p>
    ),
    code: ({ className, children, inline, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className ?? "");
      const lang  = match?.[1] ?? "typescript";

      if (!inline && match) {
        return (
          <div className={`${compact ? "my-2 rounded" : "my-4 rounded-lg"} overflow-hidden border border-[var(--vs-border)]`}>
            {!compact && (
              <div className="bg-[var(--vs-surface)] px-3 py-1.5 text-xs text-[var(--vs-muted)] border-b border-[var(--vs-border)]">
                {lang}
              </div>
            )}
            <SyntaxHighlighter
              language={lang === "ts" ? "typescript" : lang}
              style={vscDarkPlus}
              customStyle={{ margin: 0, padding: compact ? "10px 12px" : "12px 16px", background: "#1e1e1e", fontSize: compact ? "12px" : "13px", lineHeight: "1.6", borderRadius: 0 }}
              codeTagProps={{ style: MONO }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code
          className={`bg-[var(--vs-elevated)] text-[var(--vs-accent)] ${compact ? "text-xs" : "text-sm"} px-1.5 py-0.5 rounded font-mono`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className={`text-[var(--vs-body)] space-y-1 list-disc ${compact ? "text-sm mb-3 ml-3" : "mb-4 ml-4"}`}>
        {children}
      </ul>
    ),
    li: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="text-[var(--vs-fg)] font-semibold">{children}</strong>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className={`border-[var(--vs-accent)] text-[var(--vs-subtle)] italic ${compact ? "border-l-2 pl-3 my-3 text-sm" : "border-l-4 pl-4 my-4"}`}>
        {children}
      </blockquote>
    ),
    table: ({ children }: { children?: React.ReactNode }) => (
      <div className={`overflow-x-auto ${compact ? "my-3 rounded" : "my-5 rounded-lg"} border border-[var(--vs-border)]`}>
        <table className={`w-full ${compact ? "text-xs" : "text-sm"} border-collapse`}>{children}</table>
      </div>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => (
      <thead className="bg-[var(--vs-surface)]">{children}</thead>
    ),
    tbody: ({ children }: { children?: React.ReactNode }) => (
      <tbody className="divide-y divide-[var(--vs-border)]">{children}</tbody>
    ),
    ...(compact && {
      tr: ({ children }: { children?: React.ReactNode }) => <tr>{children}</tr>,
    }),
    th: ({ children }: { children?: React.ReactNode }) => (
      <th className={`${compact ? "px-3 py-2" : "px-4 py-2.5"} text-left text-xs font-semibold text-[var(--vs-subtle)] uppercase tracking-wider border-b border-[var(--vs-border)]`}>
        {children}
      </th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
      <td className={`${compact ? "px-3 py-2" : "px-4 py-2.5"} text-[var(--vs-body)]`}>{children}</td>
    ),
  };
}

export function MarkdownContent({ content, compact = false }: { content: string; compact?: boolean }) {
  const components = useMemo(() => buildComponents(compact), [compact]);
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
