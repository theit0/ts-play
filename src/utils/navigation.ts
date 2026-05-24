import { flushSync } from "react-dom";
import type { NavigateFunction, NavigateOptions } from "react-router-dom";

type DocWithVT = Document & {
  startViewTransition: (callback: () => void) => void;
};

export function navigateTo(
  navigate: NavigateFunction,
  path: string,
  options?: NavigateOptions
): void {
  if (!("startViewTransition" in document)) {
    navigate(path, options);
    return;
  }
  (document as DocWithVT).startViewTransition(() => {
    flushSync(() => navigate(path, options));
  });
}
