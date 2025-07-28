import { getParentFolderIds } from "@/app/components/drawings/tree.utils";
import { qFolders } from "@/lib/client/queries";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const openFoldersAtom = atomWithStorage<Record<string, boolean>>(
  "openFolders",
  {},
);

export default function useFileTree() {
  const [openFolders, setOpenFolders] = useAtom(openFoldersAtom);
  const { data: folders = [] } = useQuery(qFolders);

  const closeFolder = (folderId: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: false,
    }));
  };

  const folderIsOpen = (folderId: string) => {
    return openFolders[folderId] || false;
  };

  const openFolder = (folderId: string) => {
    const foldersToOpen = getParentFolderIds(folderId, folders);
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: true,
      ...Object.fromEntries(foldersToOpen.map((id) => [id, true])),
    }));
  };

  return { folderIsOpen, closeFolder, openFolder };
}
