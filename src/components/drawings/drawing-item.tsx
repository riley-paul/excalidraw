import type { DrawingSelect } from "@/lib/types";
import { cn, formatFileSize } from "@/lib/utils";
import { Text } from "@radix-ui/themes";
import { Link, useLocation } from "@tanstack/react-router";
import React from "react";
import DrawingMenu from "./drawing-menu";
import useRelativeTime from "@/hooks/use-relative-time";
import { ImageIcon } from "lucide-react";
import ItemContainer from "./item-container";

type Props = {
  drawing: DrawingSelect;
  depth: number;
};

const DrawingItem: React.FC<Props> = ({ drawing, depth }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { id, name } = drawing;
  const [showThumbnailFallback, setShowThumbnailFallback] =
    React.useState(false);

  const { pathname } = useLocation();
  const isActive = pathname.startsWith(`/drawing/${id}`);

  const relativeTime = useRelativeTime(drawing.updatedAt);
  const formattedFileSize = formatFileSize(drawing.fileSize ?? 0);

  return (
    <ItemContainer depth={depth} isActive={isActive}>
      <Link
        to="/drawing/$drawingId"
        params={{ drawingId: id }}
        className="flex w-full items-center gap-3"
      >
        <div className="rounded-2 flex size-12 items-center justify-center bg-white p-0.5">
          {showThumbnailFallback ? (
            <ImageIcon className="text-gray-11 size-6" />
          ) : (
            <img
              className="h-full w-full object-contain"
              src={`/thumbnail/${id}.png?cache=${drawing.updatedAt}`}
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
            {relativeTime} · {formattedFileSize}
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
    </ItemContainer>
  );
};

export default DrawingItem;
