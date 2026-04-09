import { qFolders } from "@/lib/client/queries";
import { DropdownMenu } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FolderInputIcon } from "lucide-react";
import React from "react";
import { buildTree, type TreeNode } from "./tree.utils";
import type { FolderSelect } from "@/lib/types";

type Props = {
  id: string;
  parentFolderId: string | null;
  handleMove: (folder: FolderSelect | null) => Promise<void>;
};

const MoveMenuItem: React.FC<{ folderNode: TreeNode } & Props> = ({
  id,
  folderNode,
  parentFolderId,
  handleMove,
}) => {
  return (
    <>
      <DropdownMenu.Item
        key={folderNode.id}
        disabled={folderNode.id === parentFolderId || folderNode.id === id}
        onClick={() => handleMove(folderNode)}
      >
        <span
          style={{ paddingLeft: `calc(${folderNode.depth + 1} * 0.75rem)` }}
        >
          {folderNode.name}
        </span>
      </DropdownMenu.Item>
      {folderNode.type == "folder" &&
        folderNode.children.map((child) => (
          <MoveMenuItem
            key={child.id}
            id={id}
            folderNode={child}
            parentFolderId={parentFolderId}
            handleMove={handleMove}
          />
        ))}
    </>
  );
};

const MoveSubMenu: React.FC<Props> = ({ id, parentFolderId, handleMove }) => {
  const { data: folders } = useSuspenseQuery(qFolders);
  const folderNodes = buildTree(folders, []);

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>
        <FolderInputIcon className="size-4 opacity-70" />
        <span>Move</span>
      </DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.Item
          disabled={parentFolderId === null}
          onClick={() => handleMove(null)}
        >
          <span className="italic">Root</span>
        </DropdownMenu.Item>
        {folderNodes.map((folder) => (
          <MoveMenuItem
            key={folder.id}
            id={id}
            folderNode={folder}
            parentFolderId={parentFolderId}
            handleMove={handleMove}
          />
        ))}
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  );
};

export default MoveSubMenu;
