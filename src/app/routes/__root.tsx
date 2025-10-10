import { qDrawings, qFolders } from "@/lib/client/queries";
import { zDrawingSortSearch } from "@/lib/types";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import UserMenu from "@/app/components/user-menu";
import { qCurrentUser } from "@/lib/client/queries";
import DrawingList from "@/app/components/drawings/drawing-list";
import RadixProvider from "@/app/components/radix-provider";
import Sidebar from "@/app/components/sidebar/sidebar";
import { Heading, Separator, Spinner } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import AddMenu from "@/app/components/add-menu";
import { PenToolIcon } from "lucide-react";
import DrawingListSearch from "../components/drawings/drawing-list-search";
import DrawingListSort from "../components/drawings/drawing-list-sort";
import React from "react";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Component,
    validateSearch: zDrawingSortSearch,
    loaderDeps: ({ search: { search, sort } }) => ({ search, sort }),
    loader: async ({ context, deps: { search, sort } }) => {
      const [folders, drawings, user] = await Promise.all([
        context.queryClient.ensureQueryData(qFolders),
        context.queryClient.ensureQueryData(qDrawings({ search, sort })),
        context.queryClient.ensureQueryData(qCurrentUser),
      ]);
      if (!user) throw new Error("No user");
      return { folders, drawings, user };
    },
  },
);

function Component() {
  const navigate = Route.useNavigate();
  const { user } = Route.useLoaderData();
  const { search } = Route.useSearch();

  const setSearch = (search: string | undefined) =>
    navigate({ search: (prev) => ({ ...prev, search }) });

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
          <div className="flex items-center gap-2 px-3 py-2">
            <DrawingListSearch search={search} setSearch={setSearch} />
            <DrawingListSort />
          </div>
          <Separator size="4" />
          <React.Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DrawingList search={search} />
          </React.Suspense>
          <Separator size="4" orientation="horizontal" />
          <UserMenu user={user} />
        </Sidebar>
      </RadixProvider>
      <Outlet />
    </main>
  );
}
