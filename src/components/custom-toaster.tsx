import { Spinner } from "@radix-ui/themes";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import React from "react";
import { Toaster } from "sonner";

const CustomToaster: React.FC = () => {
  return (
    <Toaster
      toastOptions={{
        className: "bg-panel backdrop-blur border border-gray-6",
      }}
      icons={{
        loading: <Spinner />,
        success: <CircleCheckIcon className="text-green-10 size-4" />,
        error: <TriangleAlertIcon className="text-red-10 size-4" />,
        info: <InfoIcon className="size-4" />,
      }}
    />
  );
};

export default CustomToaster;
