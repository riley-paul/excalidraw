import { alertSystemAtom } from "@/components/alert-system/alert-system.store";
import useFileTree from "@/hooks/use-file-tree";
import useMutations from "@/hooks/use-mutations";
import { qFolders } from "@/lib/client/queries";
import type { FolderSelect } from "@/lib/types";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import {
  DeleteIcon,
  EllipsisIcon,
  FolderInputIcon,
  FolderPlusIcon,
  PencilIcon,
  PenToolIcon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod/v4";

type Props = {
  folder: FolderSelect;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const FolderMenu: React.FC<Props> = ({
  folder: { id, name, parentFolderId },
  isOpen,
  setIsOpen,
}) => {
  const { removeFolder, updateFolder, createDrawing, createFolder } =
    useMutations();
  const { data: folders } = useSuspenseQuery(qFolders);

  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const handleDeleteDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Folder",
        message: `Are you sure you want to delete "${name}"? This action cannot be undone. Drawings in this folder will not be deleted.`,
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

  const handleAddDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Add Drawing",
        message: `Drawing will be created in "${name}"`,
        value: "",
        placeholder: "Enter drawing name",
        schema: z.string().min(1).max(100),
        handleSubmit: (value: string) => {
          createDrawing.mutate({ name: value, parentFolderId: id });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleAddFolder = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Add Folder",
        message: `Folder will be created in "${name}"`,
        value: "",
        placeholder: "Enter folder name",
        schema: z.string().min(1).max(100),
        handleSubmit: (value: string) => {
          createFolder.mutate({ name: value, parentFolderId: id });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const { openFolder } = useFileTree();

  const handleMoveFolder = async (folder: FolderSelect | null) => {
    if (!folder) {
      await updateFolder.mutateAsync({ id, parentFolderId: null });
      toast.success(`Moved to root folder`);
      return;
    }
    await updateFolder.mutateAsync({ id, parentFolderId: folder.id });
    toast.success(`Moved to "${folder.name}"`);
    openFolder(folder.id);
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
          <EllipsisIcon className="size-4" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleEditDrawing}>
          <PencilIcon className="size-4 opacity-70" />
          <span>Edit</span>
        </DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <FolderInputIcon className="size-4 opacity-70" />
            <span>Move</span>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item
              disabled={parentFolderId === null}
              onClick={() => handleMoveFolder(null)}
            >
              <span className="italic">Root</span>
            </DropdownMenu.Item>
            {folders.map((folder) => (
              <DropdownMenu.Item
                key={folder.id}
                disabled={folder.id === id}
                onClick={() => handleMoveFolder(folder)}
              >
                <span>{folder.name}</span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={handleAddDrawing}>
          <PenToolIcon className="size-4 opacity-70" />
          <span>Add drawing</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleAddFolder}>
          <FolderPlusIcon className="size-4 opacity-70" />
          <span>Add folder</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={handleDeleteDrawing}>
          <DeleteIcon className="size-4 opacity-70" />
          <span>Delete</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default FolderMenu;
