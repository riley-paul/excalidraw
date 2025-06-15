import type { DrawingSelect, FolderSelect } from "@/lib/types";

export type TreeNode =
  | ({ type: "folder"; depth: number } & FolderSelect & {
        children: TreeNode[];
      })
  | ({ type: "drawing"; depth: number } & DrawingSelect);

export function buildTree(
  folders: FolderSelect[],
  drawings: DrawingSelect[],
): TreeNode[] {
  const folderMap: Record<string, TreeNode> = {};

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
