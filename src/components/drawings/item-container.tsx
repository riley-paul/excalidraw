import { cn } from "@/lib/client/utils";
import React from "react";

type Props = React.PropsWithChildren<{
  depth: number;
  isActive?: boolean;
}>;

const ItemContainer: React.FC<Props> = ({ isActive, depth, children }) => {
  return (
    <div
      className={cn(
        "hover:bg-accent-3 group flex items-center gap-3 py-2 pr-4 pl-3 transition-colors ease-out",
        isActive && "bg-accent-6 hover:bg-accent-6",
      )}
      style={{ paddingLeft: `${0.75 + depth}rem` }}
    >
      {children}
    </div>
  );
};

export default ItemContainer;
