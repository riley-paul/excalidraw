import React from "react";
import type { AlertProps } from "./alert-system.types";
import AlertSystemContentDelete from "./alert-system.delete";
import { useAtom } from "jotai/react";
import { alertSystemAtom } from "./alert-system.store";
import AlertSystemContentError from "./alert-system.error";
import { AlertDialog } from "@radix-ui/themes";

const AlertContent: React.FC<AlertProps> = (props) => {
  switch (props.type) {
    case "delete":
      return <AlertSystemContentDelete {...props} />;
    case "error":
      return <AlertSystemContentError {...props} />;
    default:
      throw new Error(`Unsupported alert type`);
  }
};

const AlertSystem: React.FC = () => {
  const [state, dispatch] = useAtom(alertSystemAtom);
  return (
    <AlertDialog.Root
      open={state.isOpen}
      onOpenChange={(open) => open || dispatch({ type: "close" })}
    >
      <AlertDialog.Content maxWidth="450px">
        {state.data && <AlertContent {...state.data} />}
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default AlertSystem;
