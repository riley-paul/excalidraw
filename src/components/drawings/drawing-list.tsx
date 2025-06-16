import React from "react";
import DrawingItem from "./drawing-item";
import { buildTree, type TreeNode } from "./tree.utils";
import FolderItem from "./folder-item";
import { ScrollArea } from "@radix-ui/themes";
import useFileTree from "@/hooks/use-file-tree";
import { qDrawings, qFolders } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";

const TreeNodeComponent: React.FC<{
  node: TreeNode;
  treeNodes: TreeNode[];
}> = ({ node, treeNodes }) => {
  const { folderIsOpen, openFolder, closeFolder } = useFileTree(treeNodes);
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
            <TreeNodeComponent
              key={child.id}
              node={child}
              treeNodes={treeNodes}
            />
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

  return (
    <ScrollArea className="flex-1">
      {treeNodes.map((node) => (
        <TreeNodeComponent key={node.id} node={node} treeNodes={treeNodes} />
      ))}
    </ScrollArea>
  );
};

export default DrawingList;
