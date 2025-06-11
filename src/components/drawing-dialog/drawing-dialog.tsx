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

const DrawingDialog: React.FC = () => {
  const [state, dispatch] = useAtom(drawingDialogAtom);
  return (
    <Dialog
      open={state.isOpen}
      onOpenChange={(open) => dispatch({ type: open ? "open" : "close" })}
    >
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {state.drawing ? "Update" : "Create"} Drawing
            </DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DrawingDialog;
