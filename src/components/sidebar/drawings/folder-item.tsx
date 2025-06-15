import type { FolderSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Text } from "@radix-ui/themes";
import React from "react";

type Props = {
  folder: FolderSelect;
};

const FolderItem: React.FC<Props> = ({ folder }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <button
      onClick={() => setIsExpanded((prev) => !prev)}
      className="flex w-full items-center gap-2 px-3 py-2"
    >
      <i
        className={cn(
          "fas size-4 opacity-70",
          isExpanded ? "fa-folder-open" : "fa-folder",
        )}
      />
      <Text size="2" weight="medium">
        {folder.name}
      </Text>
    </button>
  );
};

export default FolderItem;
