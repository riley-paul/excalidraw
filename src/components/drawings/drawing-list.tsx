import React from "react";
import DrawingItem from "./drawing-item";
import { type TreeNode } from "./tree.utils";
import FolderItem from "./folder-item";
import { ScrollArea } from "@radix-ui/themes";
import useFileTree from "@/hooks/use-file-tree";
import { TreeContext } from "./tree-provider";

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
  const treeNodes = React.useContext(TreeContext);
  return (
    <ScrollArea className="flex-1">
      {treeNodes.map((node) => (
        <TreeNodeComponent key={node.id} node={node} />
      ))}
    </ScrollArea>
  );
};

export default DrawingList;
