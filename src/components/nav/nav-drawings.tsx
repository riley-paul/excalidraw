import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { MinimalDrawingSelect } from "@/lib/types";
import {
  ArrowUpRightIcon,
  Edit2Icon,
  LinkIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import useMutations from "@/hooks/use-mutations";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "../drawing-dialog/drawing-dialog.store";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import { Link, linkOptions } from "@tanstack/react-router";
import { useCopyToClipboard } from "react-use";
import { toast } from "sonner";

const NavDrawingMenu: React.FC<{ drawing: MinimalDrawingSelect }> = ({
  drawing,
}) => {
  const isMobile = useIsMobile();
  const { removeDrawing } = useMutations();

  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const [, dispatchDrawingDialog] = useAtom(drawingDialogAtom);

  const [state, copyToClipboard] = useCopyToClipboard();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover>
          <MoreHorizontalIcon />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem onClick={handleEditDrawing}>
          <Edit2Icon className="text-muted-foreground" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon className="text-muted-foreground" />
          <span>Copy Link</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenInNewTab}>
          <ArrowUpRightIcon className="text-muted-foreground" />
          <span>Open in New Tab</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteDrawing}>
          <Trash2Icon className="text-muted-foreground" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type Props = {
  drawings: MinimalDrawingSelect[];
};

const NavDrawings: React.FC<Props> = ({ drawings }) => {
  const [, dispatch] = useAtom(drawingDialogAtom);
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Drawings</SidebarGroupLabel>
      <SidebarGroupAction onClick={() => dispatch({ type: "open" })}>
        <PlusIcon />
        <span className="sr-only">New drawing</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {drawings.map((item) => (
            <SidebarMenuItem key={item.id}>
              <Link to="/drawing/$drawingId" params={{ drawingId: item.id }}>
                {({ isActive }) => (
                  <SidebarMenuButton isActive={isActive}>
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
