import React from "react";
import type { ErrorAlertProps } from "./alert-system.types";
import { AlertDialog, Button } from "@radix-ui/themes";

const AlertSystemContentError: React.FC<ErrorAlertProps> = ({
  title,
  message,
}) => {
  return (
    <>
      <AlertDialog.Title>{title}</AlertDialog.Title>
      <AlertDialog.Description>{message}</AlertDialog.Description>
      <footer className="mt-4 flex justify-end gap-3">
        <AlertDialog.Cancel>
          <Button>Ok</Button>
        </AlertDialog.Cancel>
      </footer>
    </>
  );
};

export default AlertSystemContentError;
