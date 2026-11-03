import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import useFileTree from "@/app/hooks/use-file-tree";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useAtom } from "jotai";
import {
  DeleteIcon,
  EllipsisIcon,
  FolderPlusIcon,
  PencilIcon,
  PenToolIcon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "astro/zod";
import MoveSubMenu from "../move-sub-menu";
import type { FolderFragment } from "@/app/gql.gen";
import useFolderMutations from "@/app/hooks/mutations/use-folder-mutations";
import useDrawingMutations from "@/app/hooks/mutations/use-drawing-mutations";

type Props = {
  folder: FolderFragment;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const FolderMenu: React.FC<Props> = ({ folder, isOpen, setIsOpen }) => {
  const {
    updateFolderMutation: [updateFolder],
    deleteFolderMutation: [deleteFolder],
    createFolderMutation: [createFolder],
  } = useFolderMutations();

  const {
    createDrawingMutation: [createDrawing],
  } = useDrawingMutations();

  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const handleDeleteFolder = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Folder",
        message: `Are you sure you want to delete "${folder.name}"? This action cannot be undone. Drawings in this folder will not be deleted.`,
        handleDelete: () => {
          deleteFolder({ variables: { folderId: folder.id } });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleRenameFolder = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Rename Folder",
        message: "Update the name of your folder",
        value: folder.name,
        placeholder: "Enter new folder name",
        schema: z.string().min(1).max(100),
        handleSubmit: (name: string) => {
          updateFolder({ variables: { folderId: folder.id, input: { name } } });
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
        message: `Drawing will be created in "${folder.name}"`,
        value: "",
        placeholder: "Enter drawing name",
        schema: z.string().min(1).max(100),
        handleSubmit: (name: string) => {
          createDrawing({
            variables: { input: { name, parentFolderId: folder.id } },
          });
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
        message: `Folder will be created in "${folder.name}"`,
        value: "",
        placeholder: "Enter folder name",
        schema: z.string().min(1).max(100),
        handleSubmit: (name: string) => {
          createFolder({
            variables: { input: { name, parentFolderId: folder.id } },
          });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const { openFolder } = useFileTree();

  const handleMoveFolder = async (parentFolder: FolderFragment | null) => {
    if (!parentFolder) {
      await updateFolder({
        variables: { folderId: folder.id, input: { parentFolderId: null } },
        onCompleted: () => {
          toast.success(`Moved to root folder`);
        },
      });
      return;
    }
    await updateFolder({
      variables: {
        folderId: folder.id,
        input: { parentFolderId: parentFolder.id },
      },
      onCompleted: () => {
        toast.success(`Moved to "${parentFolder.name}"`);
        openFolder(parentFolder.id);
      },
    });
  };

  return (
    <DropdownMenu.Root modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>
        <IconButton
          className="size-4"
          size="1"
          radius="full"
          variant="ghost"
          color="gray"
        >
          <EllipsisIcon className="size-4" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleRenameFolder}>
          <PencilIcon className="size-4 opacity-70" />
          <span>Rename</span>
        </DropdownMenu.Item>
        <MoveSubMenu
          id={folder.id}
          parentFolderId={folder.parentFolderId}
          handleMove={handleMoveFolder}
        />
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
        <DropdownMenu.Item color="red" onClick={handleDeleteFolder}>
          <DeleteIcon className="size-4 opacity-70" />
          <span>Delete</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default FolderMenu;
