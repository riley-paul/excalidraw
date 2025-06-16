import type { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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