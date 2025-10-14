import type { FolderSelect } from "@/lib/types";
import { cn } from "@/lib/client/utils";
import { Text } from "@radix-ui/themes";
import React from "react";
import FolderMenu from "./folder-menu";
import { FolderIcon, FolderOpenIcon } from "lucide-react";
import ItemContainer from "../item-container";
import { getItemPadding } from "../tree.utils";

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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <ItemContainer
      dragData={{
        id: folder.id,
        type: "folder",
        parentFolderId: folder.parentFolderId,
      }}
    >
      <button
        onClick={onClick}
        className="flex flex-1 cursor-pointer items-center gap-2"
        style={getItemPadding(depth)}
      >
        {isExpanded ? (
          <FolderOpenIcon className="size-4 opacity-70" />
        ) : (
          <FolderIcon className="size-4 opacity-70" />
        )}
        <Text size="2" weight="medium" align="left">
          {folder.name}
        </Text>
      </button>
      <div
        className={cn(
          "flex items-center justify-center transition-opacity ease-out group-hover:opacity-100",
          !isMenuOpen && "opacity-0",
        )}
      >
        <FolderMenu
          folder={folder}
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
        />
      </div>
    </ItemContainer>
  );
};

export default FolderItem;
