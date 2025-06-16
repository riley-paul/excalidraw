import React from "react";
import DrawingItem from "./drawing-item";
import { type TreeNode } from "./tree.utils";
import FolderItem from "./folder-item";
import { ScrollArea } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { openFoldersAtom } from "./drawing-list.store";
import useFileTree from "@/hooks/use-file-tree";

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
  const { treeNodes } = useFileTree();

  return (
    <ScrollArea className="flex-1">
      {treeNodes.map((node) => (
        <TreeNodeComponent key={node.id} node={node} />
      ))}
    </ScrollArea>
  );
};

export default DrawingList;
