import React from "react";
import { useAtom } from "jotai/react";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { z } from "astro/zod";
import { FolderPlusIcon, PenToolIcon, PlusIcon } from "lucide-react";
import { formatForDisplay, useHotkeys } from "@tanstack/react-hotkeys";
import useFolderMutations from "../hooks/mutations/use-folder-mutations";
import useDrawingMutations from "../hooks/mutations/use-drawing-mutations";

const AddMenu: React.FC = () => {
  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const {
    createFolderMutation: [createFolder],
  } = useFolderMutations();

  const {
    createDrawingMutation: [createDrawing],
  } = useDrawingMutations();

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
          createDrawing({ variables: { input: { name: value } } });
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
          createFolder({ variables: { input: { name: value } } });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  useHotkeys([
    {
      hotkey: "C",
      callback: handleAddDrawing,
      options: { ignoreInputs: true },
    },
    {
      hotkey: "Shift+C",
      callback: handleAddFolder,
      options: { ignoreInputs: true },
    },
  ]);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <IconButton size="3" variant="solid" radius="full">
          <PlusIcon className="size-5" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          onClick={handleAddDrawing}
          shortcut={formatForDisplay("C")}
        >
          <PenToolIcon className="size-4 opacity-70" />
          <span>Add drawing</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={handleAddFolder}
          shortcut={formatForDisplay("Shift+C")}
        >
          <FolderPlusIcon className="size-4 opacity-70" />
          <span>Add folder</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default AddMenu;
