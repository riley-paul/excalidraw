import type { DrawingSortField, DrawingSortOption } from "@/lib/types";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { ArrowDown, ArrowUp, SortDescIcon } from "lucide-react";
import React from "react";

type Props = {
  sortOption: DrawingSortOption;
  setSortOption: React.Dispatch<React.SetStateAction<DrawingSortOption>>;
};

const drawingSortFieldLabels: Record<DrawingSortField, string> = {
  name: "Name",
  updatedAt: "Last modified",
  createdAt: "Date created",
  fileSize: "File size",
};

const Arrow: React.FC<{
  isSelected: boolean;
  direction: "asc" | "desc";
}> = ({ isSelected, direction }) => {
  if (!isSelected) return <div className="size-4" />;
  return direction === "asc" ? (
    <ArrowUp className="size-4" />
  ) : (
    <ArrowDown className="size-4" />
  );
};

const DrawingListSort: React.FC<Props> = ({ sortOption, setSortOption }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft">
          <SortDescIcon className="size-4" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenu.Label>Sort by</DropdownMenu.Label>
        {Object.entries(drawingSortFieldLabels).map(([key, label]) => {
          const field = key as DrawingSortField;
          const isSelected = sortOption.field === field;

          const handleSelect = () => {
            if (isSelected) {
              // Toggle direction
              setSortOption((prev) => ({
                field,
                direction: prev.direction === "asc" ? "desc" : "asc",
              }));
            } else {
              // Set new field with default direction
              setSortOption({ field, direction: "asc" });
            }
          };

          return (
            <DropdownMenu.Item key={field} onSelect={handleSelect}>
              <Arrow isSelected={isSelected} direction={sortOption.direction} />
              <span>{label}</span>
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DrawingListSort;
