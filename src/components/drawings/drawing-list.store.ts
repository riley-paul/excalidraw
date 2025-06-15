import { atomWithStorage } from "jotai/utils";

export const openFoldersAtom = atomWithStorage<Record<string, boolean>>(
  "openFolders",
  {},
);
