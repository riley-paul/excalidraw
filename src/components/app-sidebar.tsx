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
import { qCurrentUser } from "@/lib/client/queries";

const AppSidebar: React.FC = () => {
  const { data: user } = useQuery(qCurrentUser);

  if (!user) return null;

  return (
    <Sidebar>
      <SidebarHeader>Excalidraw</SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
