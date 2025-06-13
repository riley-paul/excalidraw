import React from "react";

import UserMenu from "./user-menu";
import { useQuery } from "@tanstack/react-query";
import { qCurrentUser, qDrawings } from "@/lib/client/queries";
import DrawingList from "./drawings/drawing-list";
import RadixProvider from "../radix-provider";
import Sidebar from "./sidebar";
import { Heading } from "@radix-ui/themes";

const AppSidebar: React.FC = () => {
  const { data: user } = useQuery(qCurrentUser);
  const { data: drawings = [] } = useQuery(qDrawings);

  if (!user) return null;

  return (
    <RadixProvider overrideAppearance="dark">
      <Sidebar>
        <header className="p-3">
          <Heading>Exacalidraw</Heading>
        </header>
        <div className="flex-1">
          <DrawingList drawings={drawings} />
        </div>
        <UserMenu user={user} />
      </Sidebar>
    </RadixProvider>
  );
};

export default AppSidebar;
