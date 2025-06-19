import { centerDragPreviewOnMouse, cn } from "@/lib/client/utils";
import React, { useEffect, useRef } from "react";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
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

type Props = React.PropsWithChildren<{
  depth: number;
  isActive?: boolean;
  isOverlay?: boolean;
}>;

const ItemContainer: React.FC<Props> = (props) => {
  const { isActive, depth, isOverlay, children } = props;

  const elementRef = useRef<HTMLDivElement>(null);
  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  useEffect(() => {
    const element = elementRef.current;
    invariant(element);

    return combine(
      draggable({
        element,
        onGenerateDragPreview({ location, nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: centerDragPreviewOnMouse(location, element),
            render({ container }) {
              setDraggableState({ type: "preview", container });
            },
          });
        },
      }),
    );
  });

  return (
    <>
      <div
        ref={elementRef}
        className={cn(
          "hover:bg-accent-3 group flex items-center gap-3 py-2 pr-4 pl-3 transition-colors ease-out",
          isActive && "bg-accent-6 hover:bg-accent-6",
          isOverlay && "rounded-2 w-[320px] border bg-accent-3",
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
