import React from "react";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "../drawing-dialog/drawing-dialog.store";
import { Button, DropdownMenu, IconButton } from "@radix-ui/themes";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import { z } from "zod/v4";
import useMutations from "@/hooks/use-mutations";

const AddMenu: React.FC = () => {
  const [, dispatchDrawingDialog] = useAtom(drawingDialogAtom);
  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const { createFolder } = useMutations();

  const handleAddDrawing = () => {
    dispatchDrawingDialog({ type: "open" });
  };

  const handleAddFolder = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Add Folder",
        message: "Folder will be created in the root directory.",
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
        <IconButton size="3" variant="soft" radius="full">
          <i className="fas fa-plus" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleAddDrawing}>
          <i className="fas fa-pen-nib opacity-70"></i>
          <span>Add drawing</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleAddFolder}>
          <i className="fas fa-folder opacity-70"></i>
          <span>Add folder</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default AddMenu;
