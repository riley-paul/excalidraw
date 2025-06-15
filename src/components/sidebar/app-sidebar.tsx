import React from "react";

import UserMenu from "./user-menu";
import { useQuery } from "@tanstack/react-query";
import { qCurrentUser, qDrawings } from "@/lib/client/queries";
import DrawingList from "./drawings/drawing-list";
import RadixProvider from "../radix-provider";
import Sidebar from "./sidebar";
import { Heading, Separator } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import AddMenu from "./add-menu";

const AppSidebar: React.FC = () => {
  const { data: user } = useQuery(qCurrentUser);
  const { data: drawings = [] } = useQuery(qDrawings);

  if (!user) return null;

  return (
    <RadixProvider overrideAppearance="dark">
      <Sidebar>
        <header className="gap-3 p-3 flex items-center justify-between">
          <Link to="/">
            <Heading>Excalidraw</Heading>
          </Link>
          <AddMenu />
        </header>
        <Separator size="4" orientation="horizontal" />
        <DrawingList drawings={drawings} />
        <Separator size="4" orientation="horizontal" />
        <UserMenu user={user} />
      </Sidebar>
    </RadixProvider>
  );
};

export default AppSidebar;
