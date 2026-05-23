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
      <div className="max-w-3xl mx-auto px-6 py-8">
        <article>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-[#e8e8f0] mb-6 pb-3 border-b border-[#2a2a45]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold text-[#e8e8f0] mt-8 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold text-[#e8e8f0] mt-6 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[#c5c5d8] leading-relaxed mb-4">{children}</p>
              ),
              code: ({ className, children, inline, ...props }: CodeProps) => {
                const match = /language-(\w+)/.exec(className ?? "");
                const lang = match?.[1] ?? "typescript";

                if (!inline && match) {
                  return (
                    <div className="my-4 rounded-lg overflow-hidden border border-[#2a2a45]">
                      <div className="bg-[#141428] px-3 py-1.5 text-xs text-[#6b7280] border-b border-[#2a2a45]">
                        {lang}
                      </div>
                      <SyntaxHighlighter
                        language={lang === "ts" ? "typescript" : lang}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: "12px 16px",
                          background: "#0e0e1a",
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
                    className="bg-[#1e1e38] text-[#00d4aa] text-sm px-1.5 py-0.5 rounded font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              ul: ({ children }) => (
                <ul className="text-[#c5c5d8] mb-4 space-y-1 ml-4 list-disc">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="text-[#c5c5d8] mb-4 space-y-1 ml-4 list-decimal">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="text-[#e8e8f0] font-semibold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-[#c5c5d8] italic">{children}</em>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#00d4aa] pl-4 my-4 text-[#9ca3af] italic">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-5 rounded-lg border border-[#2a2a45]">
                  <table className="w-full text-sm border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-[#141428]">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-[#2a2a45]">{children}</tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-[#1a1a30] transition-colors">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-[#9ca3af] uppercase tracking-wider border-b border-[#2a2a45]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2.5 text-[#c5c5d8]">
                  {children}
                </td>
              ),
              hr: () => <hr className="border-[#2a2a45] my-6" />,
            }}
          >
            {lesson.content || ""}
          </ReactMarkdown>
        </article>

        <div className="mt-10 flex items-center justify-between">
          <span className="text-sm text-[#6b7280]">
            {isDone ? "✓ Completada" : ""}
          </span>
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#00d4aa] text-[#0e0e1a] font-semibold text-sm hover:bg-[#00c49a] transition-colors"
          >
            {next ? "Continuar" : "Finalizar capítulo"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
