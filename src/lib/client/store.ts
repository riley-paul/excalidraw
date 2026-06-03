import { atom, createStore } from "jotai";

export const jotaiStore = createStore();
export const ignoreDirtyAtom = atom(false);
