import React from "react";
import DrawingItem from "./drawing-item";
import ScrollShadowWrapper from "@/components/scroll-shadow-wrapper";
import { qDrawings, qFolders } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { buildTree, type TreeNode } from "./tree.utils";
import FolderItem from "./folder-item";
import { ScrollArea } from "@radix-ui/themes";

const TreeNodeComponent: React.FC<{ node: TreeNode }> = ({ node }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (node.type === "folder") {
    return (
      <div className="grid">
        <FolderItem
          folder={node}
          isExpanded={isExpanded}
          onClick={() => setIsExpanded((prev) => !prev)}
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

  React.useEffect(() => {
    console.log("Folders:", folders);
    console.log("Drawings:", drawings);
    console.log("Tree Nodes:", treeNodes);
  }, [treeNodes]);

  return (
    <ScrollArea className="flex-1">
      {treeNodes.map((node) => (
        <TreeNodeComponent key={node.id} node={node} />
      ))}
    </ScrollArea>
  );
};

export default DrawingList;
