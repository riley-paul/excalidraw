import React from "react";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ErrorAlertProps } from "./alert-system.types";

const AlertSystemContentError: React.FC<ErrorAlertProps> = ({
  title,
  message,
}) => {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{message}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Ok</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  );
};

export default AlertSystemContentError;
