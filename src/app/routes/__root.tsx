import { qDrawings, qFolders } from "@/lib/client/queries";
import { zDrawingSortSearch } from "@/lib/types";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import UserMenu from "@/app/components/user-menu";
import { qCurrentUser } from "@/lib/client/queries";
import DrawingList from "@/app/components/drawings/drawing-list";
import RadixProvider from "@/app/components/radix-provider";
import Sidebar from "@/app/components/sidebar/sidebar";
import { Heading, Separator } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import AddMenu from "@/app/components/add-menu";
import { PenToolIcon } from "lucide-react";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Component,
    validateSearch: zDrawingSortSearch,
    loader: async ({ context }) => {
      const [folders, drawings, user] = await Promise.all([
        context.queryClient.ensureQueryData(qFolders),
        context.queryClient.ensureQueryData(qDrawings({})),
        context.queryClient.ensureQueryData(qCurrentUser),
      ]);
      if (!user) throw new Error("No user");
      return { folders, drawings, user };
    },
  },
);

function Component() {
  const { user } = Route.useLoaderData();
  return (
    <main className="flex">
      <RadixProvider appearance="dark">
        <Sidebar>
          <header className="flex items-center justify-between gap-3 p-3">
            <Link to="/" className="flex items-center gap-2">
              <PenToolIcon className="text-accent-9 size-6" />
              <Heading size="4">Excalidraw</Heading>
            </Link>
            <AddMenu />
          </header>
          <Separator size="4" orientation="horizontal" />
          <DrawingList />
          <Separator size="4" orientation="horizontal" />
          <UserMenu user={user} />
        </Sidebar>
      </RadixProvider>
      <Outlet />
    </main>
  );
}
