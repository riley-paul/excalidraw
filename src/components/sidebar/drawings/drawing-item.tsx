import type { DrawingSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Text } from "@radix-ui/themes";
import { Link, useLocation } from "@tanstack/react-router";
import React from "react";
import { DateTime } from "luxon";
import DrawingMenu from "./drawing-menu";

type Props = {
  drawing: DrawingSelect;
};

const DrawingItem: React.FC<Props> = ({ drawing }) => {
  const { id, title } = drawing;
  const [showThumbnailFallback, setShowThumbnailFallback] =
    React.useState(false);

  const { pathname } = useLocation();
  const isActive = pathname.startsWith(`/drawing/${id}`);

  return (
    <div
      className={cn({
        "hover:bg-accent-3 flex items-center gap-3 px-3 py-2 transition-colors":
          true,
        "bg-accent-6 hover:bg-accent-6": isActive,
      })}
    >
      <Link
        to="/drawing/$drawingId"
        params={{ drawingId: id }}
        className="flex w-full items-center gap-3"
      >
        <div className="rounded-2 flex size-16 items-center justify-center bg-white p-0.5">
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
            {title}
          </Text>
          <Text size="1" color="gray">
            {DateTime.fromISO(drawing.updatedAt).toRelative()}
          </Text>
          {drawing.description && (
            <Text size="1" mt="1">
              {drawing.description}
            </Text>
          )}
        </div>
      </Link>
      <DrawingMenu drawing={drawing} />
    </div>
  );
};

export default DrawingItem;
