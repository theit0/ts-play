type BabelMod = {
  transform: (code: string, options: Record<string, unknown>) => { code: string };
};

let _babel: BabelMod | null = null;
let _promise: Promise<void> | null = null;

export function preloadBabel(): Promise<void> {
  if (_babel) return Promise.resolve();
  if (!_promise) {
    _promise = import("@babel/standalone").then((m) => {
      _babel = m as unknown as BabelMod;
    });
  }
  return _promise;
}

export function isBabelReady(): boolean {
  return _babel !== null;
}

export interface RunResult {
  output: string[];
  error?: string;
}

function transpile(tsCode: string): string {
  if (!_babel) throw new Error("Babel not loaded yet");
  return _babel.transform(tsCode, {
    presets: ["typescript"],
    filename: "code.ts",
    retainLines: true,
  }).code;
}

export function transpileToJs(tsCode: string): { js: string; error?: string } {
  if (!_babel) return { js: "", error: "Babel not loaded yet" };
  try {
    const result = _babel.transform(tsCode, {
      presets: ["typescript"],
      filename: "code.ts",
    });
    return { js: result.code ?? "" };
  } catch (e) {
    return { js: "", error: String(e) };
  }
}

export function runCode(userCode: string, appendCode = ""): RunResult {
  const output: string[] = [];

  let jsCode: string;
  try {
    jsCode = transpile(userCode + "\n" + appendCode);
  } catch (e) {
    return { output, error: String(e) };
  }

  const capturedConsole = {
    log: (...args: unknown[]) => {
      output.push(
        args
          .map((a) => {
            if (typeof a === "string") return a;
            if (a === null) return "null";
            if (a === undefined) return "undefined";
            try {
              return JSON.stringify(a);
            } catch {
              return String(a);
            }
          })
          .join(" ")
      );
    },
    error: (...args: unknown[]) =>
      output.push("[error] " + args.map(String).join(" ")),
    warn: (...args: unknown[]) =>
      output.push("[warn] " + args.map(String).join(" ")),
    info: (...args: unknown[]) => output.push(args.map(String).join(" ")),
  };

  try {
    new Function("console", jsCode)(capturedConsole);
  } catch (e) {
    return { output, error: String(e) };
  }

  return { output };
}

export function runExpr(
  userCode: string,
  expr: string
): { value: unknown; error?: string } {
  let jsCode: string;
  try {
    jsCode = transpile(`${userCode}\n__result__ = (${expr});`);
  } catch (e) {
    return { value: undefined, error: String(e) };
  }

  try {
    const wrapped = new Function("console", `
      var __result__ = undefined;
      ${jsCode}
      return __result__;
    `);
    const value = wrapped({ log: () => {}, error: () => {}, warn: () => {} }) as unknown;
    return { value };
  } catch (e) {
    return { value: undefined, error: String(e) };
  }
}
