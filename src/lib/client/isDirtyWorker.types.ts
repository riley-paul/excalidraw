import type {
  NonDeletedExcalidrawElement,
  Ordered,
} from "@excalidraw/excalidraw/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";

export type DrawingData = {
  appState: AppState;
  elements: readonly Ordered<NonDeletedExcalidrawElement>[];
  files: BinaryFiles;
};

export type IsDirtyMessage =
  | { type: "check"; payload: DrawingData }
  | { type: "save"; payload: DrawingData };

export type IsDirtyResponse =
  | { type: "check"; changed: boolean }
  | { type: "save"; updated: boolean };
