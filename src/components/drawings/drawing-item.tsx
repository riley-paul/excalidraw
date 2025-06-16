import type { DrawingSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Text } from "@radix-ui/themes";
import { Link, useLocation } from "@tanstack/react-router";
import React from "react";
import DrawingMenu from "./drawing-menu";
import useRelativeTime from "@/hooks/use-relative-time";

type Props = {
  drawing: DrawingSelect;
  depth: number;
};

const DrawingItem: React.FC<Props> = ({ drawing, depth }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { id, name } = drawing;
  const [showThumbnailFallback, setShowThumbnailFallback] =
    React.useState(false);

  const { pathname } = useLocation();
  const isActive = pathname.startsWith(`/drawing/${id}`);

  const relativeTime = useRelativeTime(drawing.updatedAt);

  return (
    <div
      ref={ref}
      className={cn(
        "hover:bg-accent-3 group flex items-center gap-3 px-3 py-2 transition-colors ease-out",
        isActive && "bg-accent-6 hover:bg-accent-6",
      )}
      style={{ paddingLeft: `${0.75 + depth}rem` }}
    >
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
            {relativeTime}
          </Text>
        </div>
      </Link>
      <div
        className={cn(
          "flex items-center justify-center transition-opacity ease-out group-hover:opacity-100",
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
  );
};

export default DrawingItem;
