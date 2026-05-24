import * as BabelStandalone from "@babel/standalone";

// runner.ts uses Babel as a browser CDN global; provide it for the Node test env
(globalThis as unknown as Record<string, unknown>).Babel = BabelStandalone;
