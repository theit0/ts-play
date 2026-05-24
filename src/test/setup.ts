import { beforeAll } from "vitest";
import { preloadBabel } from "../utils/runner";

beforeAll(async () => {
  await preloadBabel();
});
