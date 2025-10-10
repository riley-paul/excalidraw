import { defaultDrawingSort, type DrawingsSort } from "@/lib/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const isDraggingOverDrawingListItemAtom = atom<boolean>(false);
export const drawingsSortOptionAtom = atomWithStorage<DrawingsSort>(
  "sorting",
  defaultDrawingSort,
  undefined,
  { getOnInit: true },
);

export const drawingDragDisabledAtom = atom<boolean>(false);
