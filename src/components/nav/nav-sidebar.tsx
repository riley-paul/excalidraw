import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavUser from "./nav-user";
import { useQuery } from "@tanstack/react-query";
import { qCurrentUser, qDrawings } from "@/lib/client/queries";
import NavDrawings from "./nav-drawings";
import RadixProvider from "../radix-provider";

const NavSidebar: React.FC = () => {
  const { data: user } = useQuery(qCurrentUser);
  const { data: drawings = [] } = useQuery(qDrawings);

  if (!user) return null;

  return (
    <RadixProvider overrideAppearance="dark">
      <Sidebar>
        <SidebarHeader>Excalidraw</SidebarHeader>
        <SidebarContent>
          <NavDrawings drawings={drawings} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </RadixProvider>
  );
};

export default NavSidebar;
