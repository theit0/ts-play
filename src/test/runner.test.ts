import { describe, it, expect } from "vitest";
import { runCode, runExpr, transpileToJs } from "../utils/runner";

describe("runCode", () => {
  it("executes JavaScript and captures console.log output", () => {
    const { output, error } = runCode(`console.log("hello");`);
    expect(error).toBeUndefined();
    expect(output).toEqual(["hello"]);
  });

  it("executes TypeScript (strips type annotations)", () => {
    const { output, error } = runCode(`
      const greet = (name: string): string => "Hello, " + name;
      console.log(greet("world"));
    `);
    expect(error).toBeUndefined();
    expect(output).toContain("Hello, world");
  });

  it("returns error on TypeScript syntax error", () => {
    const { output, error } = runCode(`const x: = 5;`);
    expect(error).toBeDefined();
    expect(output).toEqual([]);
  });

  it("returns error on runtime exception", () => {
    const { error } = runCode(`throw new Error("boom");`);
    expect(error).toContain("boom");
  });

  it("captures output produced before a runtime error", () => {
    const { output, error } = runCode(`
      console.log("before");
      throw new Error("after");
    `);
    expect(output).toContain("before");
    expect(error).toBeDefined();
  });

  it("appends extra code that runs after user code", () => {
    const { output, error } = runCode(
      `function add(a: number, b: number) { return a + b; }`,
      `console.log(add(2, 3));`
    );
    expect(error).toBeUndefined();
    expect(output).toContain("5");
  });

  it("captures console.error with [error] prefix", () => {
    const { output } = runCode(`console.error("oops");`);
    expect(output).toContain("[error] oops");
  });

  it("captures console.warn with [warn] prefix", () => {
    const { output } = runCode(`console.warn("careful");`);
    expect(output).toContain("[warn] careful");
  });

  it("captures console.info output", () => {
    const { output } = runCode(`console.info("info msg");`);
    expect(output).toContain("info msg");
  });

  it("serializes objects in console.log via JSON", () => {
    const { output } = runCode(`console.log({ x: 1 });`);
    expect(output).toContain('{"x":1}');
  });

  it("serializes null and undefined in console.log", () => {
    const { output } = runCode(`console.log(null, undefined);`);
    expect(output).toContain("null undefined");
  });

  it("logs multiple arguments space-joined", () => {
    const { output } = runCode(`console.log("a", "b", "c");`);
    expect(output).toContain("a b c");
  });
});

describe("transpileToJs", () => {
  it("strips type annotations from a typed variable", () => {
    const { js, error } = transpileToJs(`const x: number = 42;`);
    expect(error).toBeUndefined();
    expect(js).toContain("const x");
    expect(js).not.toContain(": number");
  });

  it("strips interface declarations entirely", () => {
    const { js, error } = transpileToJs(`interface User { name: string; age: number; }`);
    expect(error).toBeUndefined();
    expect(js).not.toContain("interface");
    expect(js).not.toContain("name: string");
  });

  it("strips function parameter and return type annotations", () => {
    const { js, error } = transpileToJs(`function add(a: number, b: number): number { return a + b; }`);
    expect(error).toBeUndefined();
    expect(js).toContain("function add");
    expect(js).not.toContain(": number");
  });

  it("strips generic type parameters", () => {
    const { js, error } = transpileToJs(`function identity<T>(x: T): T { return x; }`);
    expect(error).toBeUndefined();
    expect(js).toContain("function identity");
    expect(js).not.toContain("<T>");
  });

  it("preserves runtime logic in output", () => {
    const { js, error } = transpileToJs(`const arr: number[] = [1, 2, 3];`);
    expect(error).toBeUndefined();
    expect(js).toContain("[1, 2, 3]");
  });

  it("returns error for invalid TypeScript syntax", () => {
    const { js, error } = transpileToJs(`const x: = 5;`);
    expect(error).toBeDefined();
    expect(js).toBe("");
  });

  it("strips type-only imports", () => {
    const { js, error } = transpileToJs(`type Alias = string;`);
    expect(error).toBeUndefined();
    expect(js).not.toContain("type Alias");
  });
});

describe("runExpr", () => {
  it("evaluates a simple expression and returns its value", () => {
    const { value, error } = runExpr(``, `1 + 1`);
    expect(error).toBeUndefined();
    expect(value).toBe(2);
  });

  it("evaluates expression using symbols defined in user code", () => {
    const { value, error } = runExpr(
      `function double(n: number) { return n * 2; }`,
      `double(5)`
    );
    expect(error).toBeUndefined();
    expect(value).toBe(10);
  });

  it("returns error on invalid user code", () => {
    const { value, error } = runExpr(`const x: = ;`, `x`);
    expect(error).toBeDefined();
    expect(value).toBeUndefined();
  });

  it("returns error on runtime exception in expression", () => {
    const { value, error } = runExpr(``, `(() => { throw new Error("expr fail"); })()`);
    expect(error).toBeDefined();
    expect(value).toBeUndefined();
  });

  it("returns undefined for expression with no value", () => {
    const { value, error } = runExpr(``, `undefined`);
    expect(error).toBeUndefined();
    expect(value).toBeUndefined();
  });
});
