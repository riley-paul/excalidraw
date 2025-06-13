import type { DrawingSelect } from "@/lib/types";
import { atomWithReducer } from "jotai/utils";

type State = {
  isOpen: boolean;
  drawing: DrawingSelect | undefined;
};

type Action = { type: "open"; drawing?: DrawingSelect } | { type: "close" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "open":
      return {
        ...state,
        isOpen: true,
        drawing: action.drawing,
      };
    case "close":
      return {
        ...state,
        isOpen: false,
        drawing: undefined,
      };
    default:
      return state;
  }
};

export const drawingDialogAtom = atomWithReducer<State, Action>(
  { isOpen: false, drawing: undefined },
  reducer
);
