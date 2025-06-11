import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import AppSidebarUser from "./app-sidebar-user";
import { useQuery } from "@tanstack/react-query";
import { qCurrentUser, qDrawings } from "@/lib/client/queries";
import AppSidebarDrawings from "./app-sidebar-drawings";

const AppSidebar: React.FC = () => {
  const { data: user } = useQuery(qCurrentUser);
  const { data: drawings = [] } = useQuery(qDrawings);

  if (!user) return null;

  return (
    <Sidebar>
      <SidebarHeader>Excalidraw</SidebarHeader>
      <SidebarContent>
        <AppSidebarDrawings drawings={drawings} />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
