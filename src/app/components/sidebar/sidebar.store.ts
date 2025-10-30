import { atomWithStorage } from "jotai/utils";

export const mobileSidebarOpenAtom = atomWithStorage<boolean>(
  "mobileSidebarOpen",
  false,
  undefined,
  { getOnInit: true },
);
export const desktopSidebarOpenAtom = atomWithStorage<boolean>(
  "desktopSidebarOpen",
  false,
  undefined,
  { getOnInit: true },
);
