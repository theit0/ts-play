import { Check, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Lesson } from "../data/types";
import { useAppStore } from "../store";
import { getAdjacentLessons } from "../data/curriculum";
import type { ComponentProps } from "react";

interface Props {
  lesson: Lesson;
}

type CodeProps = ComponentProps<"code"> & { inline?: boolean };

export function ExplanationLesson({ lesson }: Props) {
  const { markComplete, completedLessons, setCurrentLesson } = useAppStore();
  const isDone = completedLessons.has(lesson.id);
  const { next } = getAdjacentLessons(lesson.id);

  function handleContinue() {
    markComplete(lesson.id);
    if (next) setCurrentLesson(next.id);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <article>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-[var(--vs-fg)] mb-6 pb-3 border-b border-[var(--vs-border)]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold text-[var(--vs-fg)] mt-8 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold text-[var(--vs-fg)] mt-6 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[var(--vs-body)] leading-relaxed mb-4">{children}</p>
              ),
              code: ({ className, children, inline, ...props }: CodeProps) => {
                const match = /language-(\w+)/.exec(className ?? "");
                const lang = match?.[1] ?? "typescript";

                if (!inline && match) {
                  return (
                    <div className="my-4 rounded-lg overflow-hidden border border-[var(--vs-border)]">
                      <div className="bg-[var(--vs-surface)] px-3 py-1.5 text-xs text-[var(--vs-muted)] border-b border-[var(--vs-border)]">
                        {lang}
                      </div>
                      <SyntaxHighlighter
                        language={lang === "ts" ? "typescript" : lang}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: "12px 16px",
                          background: "#1e1e1e",
                          fontSize: "13px",
                          lineHeight: "1.6",
                          borderRadius: 0,
                        }}
                        codeTagProps={{ style: { fontFamily: "'JetBrains Mono', Consolas, monospace" } }}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    </div>
                  );
                }

                return (
                  <code
                    className="bg-[var(--vs-elevated)] text-[var(--vs-accent)] text-sm px-1.5 py-0.5 rounded font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              ul: ({ children }) => (
                <ul className="text-[var(--vs-body)] mb-4 space-y-1 ml-4 list-disc">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="text-[var(--vs-body)] mb-4 space-y-1 ml-4 list-decimal">{children}</ol>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => (
                <strong className="text-[var(--vs-fg)] font-semibold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-[var(--vs-body)] italic">{children}</em>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[var(--vs-accent)] pl-4 my-4 text-[var(--vs-subtle)] italic">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-5 rounded-lg border border-[var(--vs-border)]">
                  <table className="w-full text-sm border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-[var(--vs-surface)]">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-[var(--vs-border)]">{children}</tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-[var(--vs-elevated)] transition-colors">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--vs-subtle)] uppercase tracking-wider border-b border-[var(--vs-border)]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2.5 text-[var(--vs-body)]">{children}</td>
              ),
              hr: () => <hr className="border-[var(--vs-border)] my-6" />,
            }}
          >
            {lesson.content || ""}
          </ReactMarkdown>
        </article>

        <div className="mt-10 flex items-center justify-between">
          <span className="text-sm text-[var(--vs-success)] flex items-center gap-1">
            {isDone && <><Check className="w-4 h-4" /> Completada</>}
          </span>
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-[var(--vs-accent)] text-white font-semibold text-sm hover:bg-[var(--vs-accent-dark)] transition-colors"
          >
            {next ? "Continuar" : "Finalizar capítulo"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
