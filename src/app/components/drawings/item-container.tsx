import { centerDragPreviewOnMouse, cn } from "@/lib/client/utils";
import React, { useEffect, useRef } from "react";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from "tiny-invariant";
import useDraggableState from "@/app/hooks/use-draggable-state";
import { Portal } from "@radix-ui/themes";
import RadixProvider from "../radix-provider";
import type { DragData } from "./drag.utils";
import { useDrawingListContext } from "./drawing-list.provider";

type Props = React.PropsWithChildren<{
  isActive?: boolean;
  isOverlay?: boolean;
  dragData: DragData;
}>;

const ItemContainer: React.FC<Props> = (props) => {
  const { isActive, isOverlay, dragData, children } = props;
  const { setIsOverListItem, isDragDisabled } = useDrawingListContext();

  const elementRef = useRef<HTMLDivElement>(null);
  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  useEffect(() => {
    const element = elementRef.current;
    invariant(element);

    return combine(
      draggable({
        element,
        canDrag: () => !isDragDisabled,
        getInitialData: () => dragData,
        onGenerateDragPreview({ location, nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: centerDragPreviewOnMouse(location, element),
            render({ container }) {
              setDraggableState({ type: "preview", container });
            },
          });
        },
        onDragStart() {
          setDraggableState({ type: "is-dragging" });
          setIsOverListItem(true);
        },
        onDrop() {
          setDraggableIdle();
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          if (isDragDisabled) return false;
          // not allowing dropping on yourself
          if (source.element === element) return false;
          return true;
        },
        getData() {
          return dragData;
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setDraggableState({ type: "is-dragging-over", closestEdge });
          setIsOverListItem(true);
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
          setIsOverListItem(false);
        },
        onDrop() {
          setDraggableIdle();
          setIsOverListItem(false);
        },
      }),
    );
  }, [dragData]);

  return (
    <>
      <div
        ref={elementRef}
        className={cn(
          "hover:bg-accent-3 group flex items-center gap-3 pr-4 pl-3 transition-colors ease-out",
          isActive && "bg-accent-6 hover:bg-accent-6",
          isOverlay && "rounded-2 bg-accent-3 w-[320px] border",
          draggableState.type === "is-dragging-over" && "bg-accent-4",
          draggableState.type === "is-dragging" && "opacity-50",
        )}
      >
        {children}
      </div>
      {draggableState.type === "preview" ? (
        <Portal container={draggableState.container}>
          <RadixProvider appearance="dark">
            <ItemContainer {...props} isOverlay />
          </RadixProvider>
        </Portal>
      ) : null}
    </>
  );
};

export default ItemContainer;
