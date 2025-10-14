import type { DrawingSelect, FolderSelect } from "@/lib/types";

type FolderNode = {
  type: "folder";
  depth: number;
  children: TreeNode[];
} & FolderSelect;

type DrawingNode = {
  type: "drawing";
  depth: number;
} & DrawingSelect;

export type TreeNode = FolderNode | DrawingNode;

export function buildTree(
  folders: FolderSelect[],
  drawings: DrawingSelect[],
): TreeNode[] {
  const folderMap: Record<string, FolderNode> = {};

  // Step 1: initialize folders with empty children (depth will be added later)
  folders.forEach((folder) => {
    folderMap[folder.id] = {
      ...folder,
      type: "folder",
      children: [],
      depth: 0, // placeholder
    };
  });

  // Step 2: nest folders (temporarily ignoring depth)
  const roots: TreeNode[] = [];
  folders.forEach((folder) => {
    const node = folderMap[folder.id];
    if (folder.parentFolderId && folderMap[folder.parentFolderId]) {
      folderMap[folder.parentFolderId].children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Step 3: assign drawings to folders (also depth = 0 placeholder)
  drawings.forEach((drawing) => {
    const node: TreeNode = {
      ...drawing,
      type: "drawing",
      depth: 0, // placeholder
    };
    if (drawing.parentFolderId && folderMap[drawing.parentFolderId]) {
      folderMap[drawing.parentFolderId].children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Step 4: recursively assign correct depth
  function assignDepth(nodes: TreeNode[], depth: number) {
    for (const node of nodes) {
      node.depth = depth;
      if (node.type === "folder") {
        assignDepth(node.children, depth + 1);
      }
    }
  }

  assignDepth(roots, 0);

  return roots;
}

export function getParentFolderIds(
  folderId: string,
  folders: FolderSelect[],
): string[] {
  const folderMap = new Map(folders.map((f) => [f.id, f]));

  const parentIds: string[] = [];
  let current = folderMap.get(folderId);

  while (current && current.parentFolderId) {
    parentIds.push(current.parentFolderId);
    current = folderMap.get(current.parentFolderId);
  }

  return parentIds;
}

export const getItemPadding = (depth: number): React.CSSProperties => ({
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  paddingLeft: `${0.75 + depth}rem`,
});
