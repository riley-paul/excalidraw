import { alertSystemAtom } from "@/components/alert-system/alert-system.store";
import { drawingDialogAtom } from "@/components/drawing-dialog/drawing-dialog.store";
import { useIsMobile } from "@/hooks/use-mobile";
import useMutations from "@/hooks/use-mutations";
import type { DrawingSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DropdownMenu, IconButton, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { useAtom } from "jotai";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

type Props = {
  drawing: DrawingSelect;
};

const Menu: React.FC<{ drawing: DrawingSelect }> = ({ drawing }) => {
  const isMobile = useIsMobile();
  const { removeDrawing } = useMutations();

  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const [, dispatchDrawingDialog] = useAtom(drawingDialogAtom);

  const [, copyToClipboard] = useCopyToClipboard();

  const handleDeleteDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Drawing",
        message: `Are you sure you want to delete "${drawing.title}"? This action cannot be undone.`,
        handleDelete: () => {
          removeDrawing.mutate(drawing);
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleEditDrawing = () => {
    dispatchDrawingDialog({
      type: "open",
      drawing,
    });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/drawing/${drawing.id}`;
    copyToClipboard(link);
    toast.success("Link copied to clipboard", { description: link });
  };

  const handleOpenInNewTab = () => {
    const link = `${window.location.origin}/drawing/${drawing.id}`;
    window.open(link, "_blank");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          className="size-4!"
          size="1"
          radius="full"
          variant="ghost"
          color="gray"
        >
          <i className="fas fa-ellipsis" />
          <span className="sr-only">More</span>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenu.Item onClick={handleEditDrawing}>
          <i className="fas fa-pen opacity-70" />
          <span>Edit</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={handleCopyLink}>
          <i className="fas fa-link opacity-70" />
          <span>Copy Link</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleOpenInNewTab}>
          <i className="fas fa-up-right-from-square opacity-70" />
          <span>Open in New Tab</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={handleDeleteDrawing}>
          <i className="fas fa-trash opacity-70" />
          <span>Delete</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const DrawingItem: React.FC<Props> = ({ drawing }) => {
  const { id, title } = drawing;
  return (
    <Link to="/drawing/$drawingId" params={{ drawingId: id }}>
      {({ isActive }) => (
        <div
          className={cn({
            "hover:bg-accent-3 flex items-center gap-3 px-3 py-2 transition-colors":
              true,
            "bg-accent-6 hover:bg-accent-6": isActive,
          })}
        >
          <div className="size-8 bg-white">
            <img src={`/thumnail/${id}.png`} />
          </div>
          <Text
            weight={isActive ? "bold" : "medium"}
            size="2"
            className="flex-1"
          >
            {title}
          </Text>
          <Menu drawing={drawing} />
        </div>
      )}
    </Link>
  );
};

export default DrawingItem;
