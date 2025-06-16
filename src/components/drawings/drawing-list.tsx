import React from "react";
import DrawingItem from "./drawing-item";
import { qDrawings, qFolders } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { buildTree, type TreeNode } from "./tree.utils";
import FolderItem from "./folder-item";
import { ScrollArea } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { openFoldersAtom } from "./drawing-list.store";

const TreeNodeComponent: React.FC<{ node: TreeNode }> = ({ node }) => {
  const [openFolders, setOpenFolders] = useAtom(openFoldersAtom);

  if (node.type === "folder") {
    const isExpanded = openFolders[node.id] || false;
    return (
      <div className="grid">
        <FolderItem
          folder={node}
          isExpanded={isExpanded}
          onClick={() =>
            setOpenFolders((prev) => ({
              ...prev,
              [node.id]: !prev[node.id],
            }))
          }
          depth={node.depth}
        />
        {isExpanded &&
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

  return (
    <ScrollArea className="flex-1">
      {treeNodes.map((node) => (
        <TreeNodeComponent key={node.id} node={node} />
      ))}
    </ScrollArea>
  );
};

export default DrawingList;
