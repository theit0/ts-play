import { useState } from "react";
import type { MouseEvent } from "react";

export function useDragResize(
  initialSize: number,
  direction: "vertical" | "horizontal",
  min: number,
  max: number
) {
  const [size, setSize] = useState(initialSize);

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const startPos = direction === "vertical" ? e.clientY : e.clientX;
    const startSize = size;

    document.body.style.cursor = direction === "vertical" ? "row-resize" : "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: globalThis.MouseEvent) => {
      const pos = direction === "vertical" ? ev.clientY : ev.clientX;
      // drag toward top/left increases size
      const next = Math.max(min, Math.min(max, startSize + (startPos - pos)));
      setSize(next);
    };

    const onUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return { size, onMouseDown };
}
