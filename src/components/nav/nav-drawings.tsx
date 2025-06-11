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
  LinkIcon,
  MoreHorizontalIcon,
  PlusIcon,
  StarOffIcon,
  Trash2Icon,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import useMutations from "@/hooks/use-mutations";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "../drawing-dialog/drawing-dialog.store";
import { alertSystemAtom } from "../alert-system/alert-system.store";

const NavDrawingMenu: React.FC<{ drawing: MinimalDrawingSelect }> = ({
  drawing,
}) => {
  const isMobile = useIsMobile();
  const { removeDrawing } = useMutations();

  const [, dispatch] = useAtom(alertSystemAtom);
  const handleDeleteDrawing = () => {
    dispatch({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Drawing",
        message: `Are you sure you want to delete "${drawing.title}"? This action cannot be undone.`,
        handleDelete: () => {
          removeDrawing.mutate(drawing);
          dispatch({ type: "close" });
        },
      },
    });
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
        <DropdownMenuItem>
          <StarOffIcon className="text-muted-foreground" />
          <span>Remove from Favorites</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LinkIcon className="text-muted-foreground" />
          <span>Copy Link</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
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
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton>
                <span>{item.title}</span>
                <NavDrawingMenu drawing={item} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavDrawings;
