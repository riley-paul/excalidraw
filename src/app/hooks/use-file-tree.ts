import { getParentFolderIds } from "@/app/components/drawings/tree.utils";
import { useQuery } from "@apollo/client/react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { GetFoldersDocument } from "../gql.gen";

const openFoldersAtom = atomWithStorage<Record<string, boolean>>(
  "openFolders",
  {},
);

export default function useFileTree() {
  const [openFolders, setOpenFolders] = useAtom(openFoldersAtom);
  const { data: { folders = [] } = {} } = useQuery(GetFoldersDocument);

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
