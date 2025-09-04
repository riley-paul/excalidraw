import React from "react";

import UserMenu from "./user-menu";
import { useQuery } from "@tanstack/react-query";
import { qCurrentUser } from "@/lib/client/queries";
import DrawingList from "../drawings/drawing-list";
import RadixProvider from "../radix-provider";
import Sidebar from "./sidebar";
import { Heading, Separator } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import AddMenu from "./add-menu";
import { PenToolIcon } from "lucide-react";

const AppSidebar: React.FC = () => {
  const { data: user } = useQuery(qCurrentUser);

  if (!user) return null;

  return (
    <RadixProvider appearance="dark">
      <Sidebar>
        <header className="flex items-center justify-between gap-3 p-3">
          <Link to="/">
            <Heading className="flex items-center gap-2">
              <PenToolIcon className="text-accent-9 size-7" />
              <span>Excalidraw</span>
            </Heading>
          </Link>
          <AddMenu />
        </header>
        <Separator size="4" orientation="horizontal" />
        <DrawingList />
        <Separator size="4" orientation="horizontal" />
        <UserMenu user={user} />
      </Sidebar>
    </RadixProvider>
  );
};

export default AppSidebar;
