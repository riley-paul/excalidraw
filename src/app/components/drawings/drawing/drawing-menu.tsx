import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useAtom } from "jotai";
import {
  CopyIcon,
  DeleteIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  Link2Icon,
  PencilIcon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { z } from "astro/zod";
import MoveSubMenu from "../move-sub-menu";
import type { FolderFragment, ShallowDrawingFragment } from "@/app/gql.gen";
import useDrawingMutations from "@/app/hooks/mutations/use-drawing-mutations";

type Props = {
  drawing: ShallowDrawingFragment;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const DrawingMenu: React.FC<Props> = ({ drawing, isOpen, setIsOpen }) => {
  const {
    deleteDrawingMutation: [deleteDrawing],
    updateDrawingMutation: [updateDrawing],
    duplicateDrawingMutation: [duplicateDrawing],
  } = useDrawingMutations();

  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const [, copyToClipboard] = useCopyToClipboard();

  const handleDeleteDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Drawing",
        message: `Are you sure you want to delete "${drawing.name}"? This action cannot be undone.`,
        handleDelete: () => {
          deleteDrawing({ variables: { drawingId: drawing.id } });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleRenameDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Rename Drawing",
        message: "Update the name of your drawing",
        value: drawing.name,
        placeholder: "Enter new drawing name",
        schema: z.string().min(1).max(100),
        handleSubmit: (name: string) => {
          updateDrawing({
            variables: { drawingId: drawing.id, input: { name } },
          });
          dispatchAlert({ type: "close" });
          toast.success("Drawing updated successfully");
        },
      },
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

  const handleMoveDrawing = async (parentFolder: FolderFragment | null) => {
    if (!parentFolder) {
      await updateDrawing({
        variables: { drawingId: drawing.id, input: { parentFolderId: null } },
      });
      toast.success(`Moved to root folder`);
      return;
    }
    await updateDrawing({
      variables: {
        drawingId: drawing.id,
        input: { parentFolderId: parentFolder.id },
      },
    });
    toast.success(`Moved to ${parentFolder.name}`);
  };

  const handleDuplicateDrawing = async () => {
    await duplicateDrawing({ variables: { drawingId: drawing.id } });
    toast.success(`Duplicated drawing "${drawing.name}"`);
  };

  return (
    <DropdownMenu.Root modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>
        <IconButton
          className="size-4"
          size="1"
          radius="full"
          variant="ghost"
          color="gray"
        >
          <EllipsisIcon className="size-4" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleRenameDrawing}>
          <PencilIcon className="size-4 opacity-70" />
          <span>Rename</span>
        </DropdownMenu.Item>

        <DropdownMenu.Item onClick={handleDuplicateDrawing}>
          <CopyIcon className="size-4 opacity-70" />
          <span>Duplicate</span>
        </DropdownMenu.Item>
        <MoveSubMenu
          id={drawing.id}
          parentFolderId={drawing.parentFolderId}
          handleMove={handleMoveDrawing}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={handleCopyLink}>
          <Link2Icon className="size-4 opacity-70" />
          <span>Copy Link</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleOpenInNewTab}>
          <ExternalLinkIcon className="size-4 opacity-70" />
          <span>Open in New Tab</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="red" onClick={handleDeleteDrawing}>
          <DeleteIcon className="size-4 opacity-70" />
          <span>Delete</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DrawingMenu;
