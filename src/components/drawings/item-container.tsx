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
import useDraggableState from "@/hooks/use-draggable-state";
import { Portal } from "@radix-ui/themes";
import RadixProvider from "../radix-provider";
import type { DragData } from "./drag.utils";
import { useAtom } from "jotai";
import { isDraggingOverDrawingListItemAtom } from "./drawing-list.store";

type Props = React.PropsWithChildren<{
  depth: number;
  isActive?: boolean;
  isOverlay?: boolean;
  dragData: DragData;
}>;

const ItemContainer: React.FC<Props> = (props) => {
  const { depth, isActive, isOverlay, dragData, children } = props;
  const [, setIsOver] = useAtom(isDraggingOverDrawingListItemAtom);

  const elementRef = useRef<HTMLDivElement>(null);
  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  useEffect(() => {
    const element = elementRef.current;
    invariant(element);

    return combine(
      draggable({
        element,
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
          setIsOver(true);
        },
        onDrop() {
          setDraggableIdle();
        },
      }),
      dropTargetForElements({
        element,
        getData() {
          return dragData;
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setDraggableState({ type: "is-dragging-over", closestEdge });
          setIsOver(true);
        },
        onDrag({ self, source }) {
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
          setIsOver(false);
        },
        onDrop() {
          setDraggableIdle();
          setIsOver(false);
        },
      }),
    );
  }, [dragData]);

  return (
    <>
      <div
        ref={elementRef}
        className={cn(
          "hover:bg-accent-3 group flex items-center gap-3 py-2 pr-4 pl-3 transition-colors ease-out",
          isActive && "bg-accent-6 hover:bg-accent-6",
          isOverlay && "rounded-2 bg-accent-3 w-[320px] border",
          draggableState.type === "is-dragging-over" && "bg-accent-4",
        )}
        style={{ paddingLeft: `${0.75 + depth}rem` }}
      >
        {children}
      </div>
      {draggableState.type === "preview" ? (
        <Portal container={draggableState.container}>
          <RadixProvider overrideAppearance="dark">
            <ItemContainer {...props} isOverlay />
          </RadixProvider>
        </Portal>
      ) : null}
    </>
  );
};

export default ItemContainer;
