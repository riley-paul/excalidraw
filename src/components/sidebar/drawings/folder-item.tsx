import type { FolderSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Text } from "@radix-ui/themes";
import React from "react";
import FolderMenu from "./folder-menu";

type Props = {
  folder: FolderSelect;
  onClick: () => void;
  isExpanded?: boolean;
};

const FolderItem: React.FC<Props> = ({ folder, isExpanded, onClick }) => {
  return (
    <div className="flex w-full items-center gap-2 px-3 py-2">
      <button onClick={onClick} className="flex flex-1 items-center gap-2">
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
      <FolderMenu folder={folder} />
    </div>
  );
};

export default FolderItem;
