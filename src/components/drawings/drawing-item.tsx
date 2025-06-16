import type { DrawingSelect } from "@/lib/types";
import { centerDragPreviewOnMouse, cn } from "@/lib/utils";
import { Portal, Text } from "@radix-ui/themes";
import { Link, useLocation } from "@tanstack/react-router";
import React from "react";
import { DateTime } from "luxon";
import DrawingMenu from "./drawing-menu";
import { useHover } from "usehooks-ts";
import invariant from "tiny-invariant";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import useDraggableState from "@/hooks/use-draggable-state";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import RadixProvider from "../radix-provider";
import Gripper from "../gripper";
import { GripVertical } from "lucide-react";

type Props = {
  drawing: DrawingSelect;
  depth: number;
};

const DrawingItem: React.FC<Props> = ({ drawing, depth }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const gripperRef = React.useRef<HTMLButtonElement>(null);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isHovering = useHover(ref);

  const { id, name } = drawing;
  const [showThumbnailFallback, setShowThumbnailFallback] =
    React.useState(false);

  const { pathname } = useLocation();
  const isActive = pathname.startsWith(`/drawing/${id}`);

  // Dragging
  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  React.useEffect(() => {
    const element = ref.current;
    const gripper = gripperRef.current;
    invariant(element);
    invariant(gripper);

    return combine(
      draggable({
        element: gripper,
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
        },
        onDrop() {
          setDraggableIdle();
        },
      }),
    );
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "group hover:bg-accent-3 relative flex items-center gap-3 px-3 py-2 transition-colors",
          isActive && "bg-accent-6 hover:bg-accent-6",
        )}
        style={{ paddingLeft: `${1 + depth}rem` }}
      >
        <button
          ref={gripperRef}
          className="text-gray-10 hover:text-gray-12 absolute left-0 cursor-grab opacity-0 transition-colors group-hover:opacity-100"
        >
          <GripVertical className="size-4" />
        </button>
        <Link
          to="/drawing/$drawingId"
          params={{ drawingId: id }}
          className="flex w-full items-center gap-3"
        >
          <div className="rounded-2 flex size-12 items-center justify-center bg-white p-0.5">
            {showThumbnailFallback ? (
              <i className="fas fa-image text-gray-11 text-6" />
            ) : (
              <img
                className="h-full w-full object-contain"
                src={`/thumbnail/${id}.png`}
                onError={() => {
                  setShowThumbnailFallback(true);
                }}
              />
            )}
          </div>
          <div className="grid flex-1">
            <Text weight={isActive ? "bold" : "medium"} size="2">
              {name}
            </Text>
            <Text size="1" color="gray">
              {DateTime.fromISO(drawing.updatedAt).toRelative()}
            </Text>
          </div>
        </Link>
        <div
          className={cn(
            "flex items-center justify-center transition-opacity group-hover:opacity-100",
            !isMenuOpen && "opacity-0",
          )}
        >
          <DrawingMenu
            drawing={drawing}
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
          />
        </div>
      </div>
      {draggableState.type === "preview" ? (
        <Portal container={draggableState.container}>
          <RadixProvider overrideAppearance="dark">
            <div className="w-[300px]">
              <DrawingItem drawing={drawing} depth={depth} />
            </div>
          </RadixProvider>
        </Portal>
      ) : null}
    </>
  );
};

export default DrawingItem;
