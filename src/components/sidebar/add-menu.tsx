import React from "react";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "../drawing-dialog/drawing-dialog.store";
import { Button, DropdownMenu, IconButton } from "@radix-ui/themes";

const AddMenu: React.FC = () => {
  const [, dispatchDrawingDialog] = useAtom(drawingDialogAtom);
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <IconButton size="3" variant="soft" radius="full">
          <i className="fas fa-plus" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          onClick={() => dispatchDrawingDialog({ type: "open" })}
        >
          <i className="fas fa-pen-nib opacity-70"></i>
          <span>Add drawing</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <i className="fas fa-folder opacity-70"></i>
          <span>Add folder</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default AddMenu;
