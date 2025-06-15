import type { FolderSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Text } from "@radix-ui/themes";
import React from "react";
import FolderMenu from "./folder-menu";
import { useHover } from "usehooks-ts";

type Props = {
  folder: FolderSelect;
  onClick: () => void;
  isExpanded?: boolean;
  depth: number;
};

const FolderItem: React.FC<Props> = ({
  folder,
  isExpanded,
  onClick,
  depth,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isHovering = useHover(ref);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <div
      ref={ref}
      className="hover:bg-accent-3 flex w-full items-center gap-2 px-3 py-2 transition-colors"
      style={{ paddingLeft: `${0.75 + depth}rem` }}
    >
      <button
        onClick={onClick}
        className="flex flex-1 cursor-pointer items-center gap-2"
      >
        <i
          className={cn(
            "fas size-4 opacity-70",
            isExpanded ? "fa-folder-open" : "fa-folder",
          )}
        />
        <Text size="2" weight="medium" align="left">
          {folder.name}
        </Text>
      </button>
      {(isHovering || isMenuOpen) && (
        <FolderMenu
          folder={folder}
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
        />
      )}
    </div>
  );
};

export default FolderItem;
