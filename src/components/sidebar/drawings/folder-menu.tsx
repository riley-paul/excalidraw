import { alertSystemAtom } from "@/components/alert-system/alert-system.store";
import useMutations from "@/hooks/use-mutations";
import { qFolders } from "@/lib/client/queries";
import type { FolderSelect } from "@/lib/types";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React from "react";
import { toast } from "sonner";
import { z } from "zod/v4";

type Props = {
  folder: FolderSelect;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const FolderMenu: React.FC<Props> = ({
  folder: { id, name },
  isOpen,
  setIsOpen,
}) => {
  const { removeFolder, updateFolder } = useMutations();
  const { data: folders } = useSuspenseQuery(qFolders);

  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const handleDeleteDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Drawing",
        message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
        handleDelete: () => {
          removeFolder.mutate({ id });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleEditDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Edit Folder",
        message: "Update the name of your folder",
        value: name,
        placeholder: "Enter new folder name",
        schema: z.string().min(1).max(100),
        handleSubmit: (value: string) => {
          updateFolder.mutate({ id, name: value });
          dispatchAlert({ type: "close" });
          toast.success("Folder updated successfully");
        },
      },
    });
  };

  return (
    <DropdownMenu.Root modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>
        <IconButton
          className="size-4!"
          size="1"
          radius="full"
          variant="ghost"
          color="gray"
        >
          <i className="fas fa-ellipsis" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleEditDrawing}>
          <i className="fas fa-pen opacity-70" />
          <span>Edit</span>
        </DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <i className="fas fa-folder opacity-70"></i>
            <span>Move</span>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            {folders.map((folder) => (
              <DropdownMenu.Item
                key={folder.id}
                disabled={folder.id === id}
                onClick={() => {
                  updateFolder.mutate({ id, parentFolderId: folder.id });
                  toast.success(`Moved to "${folder.name}"`);
                }}
              >
                <span>{folder.name}</span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={handleDeleteDrawing}>
          <i className="fas fa-trash opacity-70" />
          <span>Delete</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default FolderMenu;
