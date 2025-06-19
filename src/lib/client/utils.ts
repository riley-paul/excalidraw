import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number, decimals = 0): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${size} ${sizes[i]}`;
}

export const getIsTyping = () =>
  document.activeElement?.tagName === "INPUT" ||
  document.activeElement?.tagName === "TEXTAREA" ||
  // @ts-expect-error
  document.activeElement?.isContentEditable;

export const centerDragPreviewOnMouse = (
  location: DragLocationHistory,
  element: HTMLElement,
) => {
  const { clientX, clientY } = location.initial.input;
  const { top, left } = element.getBoundingClientRect();

  const topOffset = clientY - top;
  const leftOffset = clientX - left;

  return () => ({ x: leftOffset, y: topOffset });
};

export const triggerElementFlash = (element: HTMLElement) => {
  element.animate(
    [
      { backgroundColor: "rgba(120,120,120,0.5)" },
      { backgroundColor: "transparent" },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
      iterations: 1,
    },
  );
};
