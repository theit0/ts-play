import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  compiledJs: { js: string; error?: string };
}

export function JsPreviewPanel({ compiledJs }: Props) {
  if (compiledJs.error) {
    return (
      <div className="h-full -mx-4 -my-2 px-4 py-2 font-mono text-xs text-[var(--vs-error)]">
        {compiledJs.error}
      </div>
    );
  }

  return (
    <div className="h-full -mx-4 -my-2">
      <SyntaxHighlighter
        language="javascript"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "8px 16px",
          background: "transparent",
          fontSize: "12px",
          lineHeight: "1.6",
          height: "100%",
          overflow: "auto",
        }}
        codeTagProps={{ style: { fontFamily: "'JetBrains Mono', Consolas, monospace" } }}
      >
        {compiledJs.js}
      </SyntaxHighlighter>
    </div>
  );
}
