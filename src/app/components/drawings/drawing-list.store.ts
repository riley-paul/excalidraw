import { defaultDrawingSort, type DrawingsSort } from "@/lib/types";
import { atomWithStorage } from "jotai/utils";

export const drawingsSortOptionAtom = atomWithStorage<DrawingsSort>(
  "sorting",
  defaultDrawingSort,
  undefined,
  { getOnInit: true },
);
