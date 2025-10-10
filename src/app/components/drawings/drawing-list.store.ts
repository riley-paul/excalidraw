import { defaultDrawingSort, type DrawingSortOption } from "@/lib/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const isDraggingOverDrawingListItemAtom = atom<boolean>(false);
export const drawingsSortOptionAtom = atomWithStorage<DrawingSortOption>(
  "sorting",
  defaultDrawingSort,
);
