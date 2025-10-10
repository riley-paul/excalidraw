import React, { useEffect, useRef } from "react";
import DrawingItem from "./drawing-item";
import { buildTree, type TreeNode } from "./tree.utils";
import FolderItem from "./folder-item";
import { ScrollArea } from "@radix-ui/themes";
import useFileTree from "@/app/hooks/use-file-tree";
import { qDrawings, qFolders } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { zDragData } from "./drag.utils";
import useMutations from "@/app/hooks/use-mutations";
import invariant from "tiny-invariant";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import useDraggableState from "@/app/hooks/use-draggable-state";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { cn } from "@/lib/client/utils";
import { useAtom } from "jotai";
import { isDraggingOverDrawingListItemAtom } from "./drawing-list.store";

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
  const { data: drawings } = useSuspenseQuery(qDrawings({}));
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

        if (targetData.type === "root") {
          const data = { id: sourceData.id, parentFolderId: null };
          if (sourceData.type === "drawing") updateDrawing.mutate(data);
          if (sourceData.type === "folder") updateFolder.mutate(data);
        }
      },
    });
  });

  const elementRef = useRef<HTMLDivElement>(null);
  const [isOverItem] = useAtom(isDraggingOverDrawingListItemAtom);
  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  useEffect(() => {
    const element = elementRef.current;
    invariant(element);

    return dropTargetForElements({
      element,
      canDrop: () => !isOverItem,
      getData() {
        return { id: "root", type: "root", parentFolderId: null };
      },
      getIsSticky() {
        return true;
      },
      onDragEnter({ self }) {
        const closestEdge = extractClosestEdge(self.data);
        setDraggableState({ type: "is-dragging-over", closestEdge });
      },
      onDrag({ self }) {
        const closestEdge = extractClosestEdge(self.data);

        // Only need to update react state if nothing has changed.
        // Prevents re-rendering.
        setDraggableState((current) => {
          if (
            current.type === "is-dragging-over" &&
            current.closestEdge === closestEdge
          ) {
            return current;
          }
          return { type: "is-dragging-over", closestEdge };
        });
      },
      onDragLeave() {
        setDraggableIdle();
      },
      onDrop() {
        setDraggableIdle();
      },
    });
  }, [isOverItem]);

  return (
    <ScrollArea
      className={cn(
        "flex-1",
        draggableState.type === "is-dragging-over" && "bg-accent-1",
      )}
    >
      <div ref={elementRef} className="pb-16">
        {treeNodes.map((node) => (
          <TreeNodeComponent key={node.id} node={node} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default DrawingList;
