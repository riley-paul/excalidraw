import { alertSystemAtom } from "@/components/alert-system/alert-system.store";
import useMutations from "@/hooks/use-mutations";
import { qFolders } from "@/lib/client/queries";
import type { DrawingSelect } from "@/lib/types";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { z } from "zod/v4";

type Props = {
  drawing: DrawingSelect;
};

const DrawingMenu: React.FC<Props> = ({ drawing }) => {
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
        message: `Are you sure you want to delete "${drawing.name}"? This action cannot be undone.`,
        handleDelete: () => {
          removeDrawing.mutate(drawing);
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
        value: drawing.name,
        placeholder: "Enter new drawing name",
        schema: z.string().min(1).max(100),
        handleSubmit: (value: string) => {
          updateDrawing.mutate({
            id: drawing.id,
            name: value,
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

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <IconButton
          className="size-4!"
          size="1"
          radius="full"
          variant="ghost"
          color="gray"
        >
          <i className="fas fa-ellipsis" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleEditDrawing}>
          <i className="fas fa-pen opacity-70" />
          <span>Edit</span>
        </DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <i className="fas fa-folder opacity-70"></i>
            <span>Move</span>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            {folders.map((folder) => (
              <DropdownMenu.Item
                key={folder.id}
                onClick={() => {
                  updateDrawing.mutate({
                    id: drawing.id,
                    parentFolderId: folder.id,
                  });
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

export default DrawingMenu;
