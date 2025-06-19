import React, { useEffect } from "react";
import DrawingItem from "./drawing-item";
import { buildTree, type TreeNode } from "./tree.utils";
import FolderItem from "./folder-item";
import { ScrollArea } from "@radix-ui/themes";
import useFileTree from "@/hooks/use-file-tree";
import { qDrawings, qFolders } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { zDragData } from "./drag.utils";
import useMutations from "@/hooks/use-mutations";

const TreeNodeComponent: React.FC<{
  node: TreeNode;
}> = ({ node }) => {
  const { folderIsOpen, openFolder, closeFolder } = useFileTree();
  if (node.type === "folder") {
    return (
      <div className="grid">
        <FolderItem
          folder={node}
          isExpanded={folderIsOpen(node.id)}
          onClick={() =>
            folderIsOpen(node.id) ? closeFolder(node.id) : openFolder(node.id)
          }
          depth={node.depth}
        />
        {folderIsOpen(node.id) &&
          node.children.map((child) => (
            <TreeNodeComponent key={child.id} node={child} />
          ))}
      </div>
    );
  }

  return <DrawingItem drawing={node} depth={node.depth} />;
};

const DrawingList: React.FC = () => {
  const { data: drawings } = useSuspenseQuery(qDrawings);
  const { data: folders } = useSuspenseQuery(qFolders);
  const treeNodes = buildTree(folders, drawings);

  const { updateDrawing, updateFolder } = useMutations();
  const { openFolder } = useFileTree();

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = zDragData.parse(source.data);
        const targetData = zDragData.parse(target.data);

        if (targetData.type === "folder") {
          const data = { id: sourceData.id, parentFolderId: targetData.id };
          if (sourceData.type === "drawing") updateDrawing.mutate(data);
          if (sourceData.type === "folder") updateFolder.mutate(data);
          openFolder(targetData.id);
        }

        if (targetData.type === "drawing") {
          const data = {
            id: sourceData.id,
            parentFolderId: targetData.parentFolderId,
          };
          if (sourceData.type === "drawing") updateDrawing.mutate(data);
          if (sourceData.type === "folder") updateFolder.mutate(data);
          if (targetData.parentFolderId) openFolder(targetData.parentFolderId);
        }
      },
    });
  });

  return (
    <ScrollArea className="flex-1">
      {treeNodes.map((node) => (
        <TreeNodeComponent key={node.id} node={node} />
      ))}
    </ScrollArea>
  );
};

export default DrawingList;
