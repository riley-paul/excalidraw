import React from "react";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "./drawing-dialog.store";
import DrawingForm from "./drawing-form";
import { Button, Dialog, Inset } from "@radix-ui/themes";

const DrawingDialog: React.FC = () => {
  const [state, dispatch] = useAtom(drawingDialogAtom);
  return (
    <Dialog.Root
      open={state.isOpen}
      onOpenChange={(open) => dispatch({ type: open ? "open" : "close" })}
    >
      <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Title>
          {state.drawing ? "Update" : "Create"} Drawing
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {state.drawing
            ? "Update the details of your drawing."
            : "Create a new drawing with the details below."}
        </Dialog.Description>
        <DrawingForm drawing={state.drawing}>
          <footer className="flex justify-end gap-3">
            <Dialog.Close>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Button type="submit">Save changes</Button>
          </footer>
        </DrawingForm>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DrawingDialog;
