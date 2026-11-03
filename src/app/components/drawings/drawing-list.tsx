import React, { useEffect, useRef } from "react";
import DrawingItem from "./drawing/drawing-item";
import { type TreeNode } from "./tree.utils";
import FolderItem from "./folder/folder-item";
import { ScrollArea, Spinner } from "@radix-ui/themes";
import useFileTree from "@/app/hooks/use-file-tree";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { zDragData } from "./drag.utils";
import invariant from "tiny-invariant";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import useDraggableState from "@/app/hooks/use-draggable-state";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { cn } from "@/app/lib/utils";
import { useDrawingListContext } from "./drawing-list.provider";
import NoSearchResultsScreen from "../screens/no-search-results";
import NoDrawingsScreen from "../screens/no-drawings";
import useDrawingMutations from "@/app/hooks/mutations/use-drawing-mutations";
import useFolderMutations from "@/app/hooks/mutations/use-folder-mutations";

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

type Props = {
  treeNodes: TreeNode[];
  isSearching: boolean;
  loading: boolean;
};

const DrawingList: React.FC<Props> = ({ loading, isSearching, treeNodes }) => {
  const { isDragDisabled, isOverListItem } = useDrawingListContext();

  const {
    updateDrawingMutation: [updateDrawing],
  } = useDrawingMutations();

  const {
    updateFolderMutation: [updateFolder],
  } = useFolderMutations();

  const { openFolder } = useFileTree();

  useEffect(() => {
    return monitorForElements({
      canMonitor: () => !isDragDisabled,
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = zDragData.parse(source.data);
        const targetData = zDragData.parse(target.data);

        if (targetData.type === "folder") {
          if (sourceData.type === "drawing")
            updateDrawing({
              variables: {
                drawingId: sourceData.id,
                input: { parentFolderId: targetData.id },
              },
            });
          if (sourceData.type === "folder")
            updateFolder({
              variables: {
                folderId: sourceData.id,
                input: { parentFolderId: targetData.id },
              },
            });
          openFolder(targetData.id);
        }

        if (targetData.type === "drawing") {
          if (sourceData.type === "drawing")
            updateDrawing({
              variables: {
                drawingId: sourceData.id,
                input: { parentFolderId: targetData.parentFolderId },
              },
            });
          if (sourceData.type === "folder")
            updateFolder({
              variables: {
                folderId: sourceData.id,
                input: { parentFolderId: targetData.parentFolderId },
              },
            });
          if (targetData.parentFolderId) openFolder(targetData.parentFolderId);
        }

        if (targetData.type === "root") {
          if (sourceData.type === "drawing")
            updateDrawing({
              variables: {
                drawingId: sourceData.id,
                input: { parentFolderId: null },
              },
            });
          if (sourceData.type === "folder")
            updateFolder({
              variables: {
                folderId: sourceData.id,
                input: { parentFolderId: null },
              },
            });
        }
      },
    });
  });

  const elementRef = useRef<HTMLDivElement>(null);
  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  useEffect(() => {
    const element = elementRef.current;
    invariant(element);

    return dropTargetForElements({
      element,
      canDrop: () => !isOverListItem && !isDragDisabled,
      getData() {
        return { id: "root", type: "root", parentFolderId: null };
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
  }, [isOverListItem]);

  if (loading) {
    return (
      <div ref={elementRef} className="flex flex-1 items-center justify-center">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <ScrollArea
      className={cn(
        "flex-1",
        draggableState.type === "is-dragging-over" && "bg-accent-1",
      )}
    >
      <div ref={elementRef} className="pb-16">
        {treeNodes.length === 0 && !isSearching && <NoDrawingsScreen />}
        {treeNodes.length === 0 && isSearching && <NoSearchResultsScreen />}
        {treeNodes.map((node) => (
          <TreeNodeComponent key={node.id} node={node} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default DrawingList;
