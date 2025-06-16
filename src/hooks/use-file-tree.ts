import { type TreeNode } from "@/components/drawings/tree.utils";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const openFoldersAtom = atomWithStorage<Record<string, boolean>>(
  "openFolders",
  {},
);

export default function useFileTree(treeNodes: TreeNode[]) {
  const [openFolders, setOpenFolders] = useAtom(openFoldersAtom);

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
    // open all parent folders
    const openParentFolders = (id: string) => {
      const folder = treeNodes.find((node) => node.id === id);
      if (folder && folder.parentFolderId) {
        setOpenFolders((prev) => ({
          ...prev,
          [folder.parentFolderId!]: true,
        }));
        openParentFolders(folder.parentFolderId);
      }
    };
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: true,
    }));
    openParentFolders(folderId);
  };

  return { treeNodes, folderIsOpen, closeFolder, openFolder };
}
