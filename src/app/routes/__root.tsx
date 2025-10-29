import { qDrawings, qFolders } from "@/lib/client/queries";
import { zDrawingsSearch } from "@/lib/types";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import UserMenu from "@/app/components/user-menu";
import { qCurrentUser } from "@/lib/client/queries";
import DrawingList from "@/app/components/drawings/drawing-list";
import Sidebar from "@/app/components/sidebar/sidebar";
import { Heading, Separator, Spinner } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import AddMenu from "@/app/components/add-menu";
import { PenToolIcon } from "lucide-react";
import DrawingListSearch from "@/app/components/drawings/drawing-list-search";
import SortMenu from "@/app/components/drawings/sort-menu";
import React from "react";
import { createStore } from "jotai";
import { z } from "astro:schema";
import { DrawingListProvider } from "@/app/components/drawings/drawing-list.provider";
import { drawingsSortOptionAtom } from "../components/drawings/drawing-list.store";

const store = createStore();

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Component,
    validateSearch: z.object({ search: zDrawingsSearch.optional() }),
    loaderDeps: ({ search: { search } }) => {
      const sort = store.get(drawingsSortOptionAtom);
      return { search, sort };
    },
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
    <main className="flex max-w-screen">
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
          <SortMenu />
        </div>
        <Separator size="4" />
        <React.Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <DrawingListProvider isDragDisabled={Boolean(search)}>
            <DrawingList search={search} />
          </DrawingListProvider>
        </React.Suspense>
        <Separator size="4" orientation="horizontal" />
        <UserMenu user={user} />
      </Sidebar>
      <Outlet />
    </main>
  );
}
