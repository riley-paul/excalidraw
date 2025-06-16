import { alertSystemAtom } from "@/components/alert-system/alert-system.store";
import useMutations from "@/hooks/use-mutations";
import { qFolders } from "@/lib/client/queries";
import type { DrawingSelect } from "@/lib/types";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import {
  DeleteIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  FolderInputIcon,
  Link2Icon,
  MoveRightIcon,
  PencilIcon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { z } from "zod/v4";

type Props = {
  drawing: DrawingSelect;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const DrawingMenu: React.FC<Props> = ({
  drawing: { id, name, parentFolderId },
  isOpen,
  setIsOpen,
}) => {
  const { removeDrawing, updateDrawing } = useMutations();
  const { data: folders } = useSuspenseQuery(qFolders);

  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const [, copyToClipboard] = useCopyToClipboard();

  const handleDeleteDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Drawing",
        message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
        handleDelete: () => {
          removeDrawing.mutate({ id });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const handleEditDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Edit Drawing",
        message: "Update the name of your drawing",
        value: name,
        placeholder: "Enter new drawing name",
        schema: z.string().min(1).max(100),
        handleSubmit: (value: string) => {
          updateDrawing.mutate({ id, name: value });
          dispatchAlert({ type: "close" });
          toast.success("Drawing updated successfully");
        },
      },
    });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/drawing/${id}`;
    copyToClipboard(link);
    toast.success("Link copied to clipboard", { description: link });
  };

  const handleOpenInNewTab = () => {
    const link = `${window.location.origin}/drawing/${id}`;
    window.open(link, "_blank");
  };

  return (
    <DropdownMenu.Root modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>
        <IconButton
          className="size-4!"
          size="1"
          radius="full"
          variant="ghost"
          color="gray"
        >
          <EllipsisIcon className="size-4" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleEditDrawing}>
          <PencilIcon className="size-4 opacity-70" />
          <span>Edit</span>
        </DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <FolderInputIcon className="size-4 opacity-70" />
            <span>Move</span>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            {folders.map((folder) => (
              <DropdownMenu.Item
                key={folder.id}
                disabled={folder.id === parentFolderId}
                onClick={() => {
                  updateDrawing.mutate({ id, parentFolderId: folder.id });
                  toast.success(`Moved to "${folder.name}"`);
                }}
              >
                <span>{folder.name}</span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
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
        <DropdownMenu.Item onClick={handleDeleteDrawing}>
          <DeleteIcon className="size-4 opacity-70" />
          <span>Delete</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DrawingMenu;
