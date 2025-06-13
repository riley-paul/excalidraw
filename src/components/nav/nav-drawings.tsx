import React from "react";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import useMutations from "@/hooks/use-mutations";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "../drawing-dialog/drawing-dialog.store";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import type { DrawingSelect } from "@/lib/types";
import { DropdownMenu } from "@radix-ui/themes";

const NavDrawingMenu: React.FC<{ drawing: DrawingSelect }> = ({ drawing }) => {
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
        <SidebarMenuAction showOnHover>
          <i className="fas fa-ellipsis" />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
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

type Props = {
  drawings: DrawingSelect[];
};

const NavDrawings: React.FC<Props> = ({ drawings }) => {
  const [, dispatch] = useAtom(drawingDialogAtom);
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Drawings</SidebarGroupLabel>
      <SidebarGroupAction onClick={() => dispatch({ type: "open" })}>
        <i className="fas fa-plus fa-sm" />
        <span className="sr-only">New drawing</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {drawings.map((item) => (
            <SidebarMenuItem key={item.id}>
              <Link to="/drawing/$drawingId" params={{ drawingId: item.id }}>
                {({ isActive }) => (
                  <SidebarMenuButton isActive={isActive}>
                    <div className="size-8 bg-white">
                      <img src={`/thumnail/${item.id}.png`} />
                    </div>
                    <span>{item.title}</span>
                    <NavDrawingMenu drawing={item} />
                  </SidebarMenuButton>
                )}
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavDrawings;
