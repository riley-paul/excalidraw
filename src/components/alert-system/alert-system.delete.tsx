import React from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { DeleteAlertProps } from "./alert-system.types";

const AlertSystemContentDelete: React.FC<DeleteAlertProps> = ({
  title,
  message,
  handleDelete,
}) => {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{message}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction asChild onClick={handleDelete}>
          <Button variant="destructive">Delete</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};

export default AlertSystemContentDelete;
