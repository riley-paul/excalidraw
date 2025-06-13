import React from "react";
import type { DeleteAlertProps } from "./alert-system.types";
import { AlertDialog, Button } from "@radix-ui/themes";

const AlertSystemContentDelete: React.FC<DeleteAlertProps> = ({
  title,
  message,
  handleDelete,
}) => {
  return (
    <>
      <AlertDialog.Title>{title}</AlertDialog.Title>
      <AlertDialog.Description>{message}</AlertDialog.Description>
      <footer className="mt-4 flex justify-end gap-3">
        <AlertDialog.Cancel>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action onClick={handleDelete}>
          <Button color="red">Delete</Button>
        </AlertDialog.Action>
      </footer>
    </>
  );
};

export default AlertSystemContentDelete;
