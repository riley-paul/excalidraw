import React from "react";
import { useAtom } from "jotai/react";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { z } from "zod/v4";
import useMutations from "@/app/hooks/use-mutations";
import { FolderPlusIcon, PenToolIcon, PlusIcon } from "lucide-react";

const AddMenu: React.FC = () => {
  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const { createFolder, createDrawing } = useMutations();

  const handleAddDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Add Drawing",
        message: "Drawing will be created in the root directory",
        value: "",
        placeholder: "Enter drawing name",
        schema: z.string().min(1).max(100),
        handleSubmit: (value: string) => {
          createDrawing.mutate({ name: value });
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
        message: "Folder will be created in the root directory",
        value: "",
        placeholder: "Enter folder name",
        schema: z.string().min(1).max(100),
        handleSubmit: (value: string) => {
          createFolder.mutate({ name: value });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <IconButton size="3" variant="solid" radius="full">
          <PlusIcon className="size-5" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleAddDrawing}>
          <PenToolIcon className="size-4 opacity-70" />
          <span>Add drawing</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleAddFolder}>
          <FolderPlusIcon className="size-4 opacity-70" />
          <span>Add folder</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default AddMenu;
