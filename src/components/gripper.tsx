import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import React from "react";

type Props = {
  isGrabbing?: boolean;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Gripper = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { isGrabbing, disabled, ...rest } = props;

  return (
    <button
      ref={ref}
      {...(disabled ? { disabled: true } : rest)}
      className={cn(
        "text-gray-10 hover:text-gray-12 flex cursor-grab items-center justify-center transition-colors",
        isGrabbing && "cursor-grabbing",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <GripVertical size="1rem" />
    </button>
  );
});

export default Gripper;
