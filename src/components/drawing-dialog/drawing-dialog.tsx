import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "./drawing-dialog.store";
import DrawingForm from "./drawing-form";

const DrawingDialog: React.FC = () => {
  const [state, dispatch] = useAtom(drawingDialogAtom);
  return (
    <Dialog
      open={state.isOpen}
      onOpenChange={(open) => dispatch({ type: open ? "open" : "close" })}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {state.drawing ? "Update" : "Create"} Drawing
          </DialogTitle>
          <DialogDescription>
            {state.drawing
              ? "Update the details of your drawing."
              : "Create a new drawing with the details below."}
          </DialogDescription>
        </DialogHeader>
        <DrawingForm drawing={state.drawing}>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DrawingForm>
      </DialogContent>
    </Dialog>
  );
};

export default DrawingDialog;
