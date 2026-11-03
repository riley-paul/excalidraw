import { zDrawingsSearch } from "@/lib/types";
import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";

import UserMenu from "@/app/components/user-menu";
import DrawingList from "@/app/components/drawings/drawing-list";
import Sidebar from "@/app/components/sidebar/sidebar";
import { Heading, Progress, Separator, Spinner, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import AddMenu from "@/app/components/add-menu";
import { DraftingCompassIcon } from "lucide-react";
import DrawingListSearch from "@/app/components/drawings/drawing-list-search";
import SortMenu from "@/app/components/drawings/sort-menu";
import React from "react";
import { z } from "astro/zod";
import { DrawingListProvider } from "@/app/components/drawings/drawing-list.provider";
import { formatFileSize } from "@/app/lib/utils";
import { useQuery, useSuspenseQuery } from "@apollo/client/react";
import { GetDrawingsAndFoldersDocument, GetMeDocument } from "../gql.gen";
import type { ApolloClient } from "@apollo/client";
import { drawingsSortOptionAtom } from "../components/drawings/drawing-list.store";
import { useAtom } from "jotai";
import { buildTree } from "../components/drawings/tree.utils";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  apolloClient: ApolloClient;
}>()({
  component: Component,
  validateSearch: z.object({ search: zDrawingsSearch.optional() }),
  loader: async ({ context }) => {
    await context.apolloClient.query({ query: GetMeDocument });
  },
});

function Component() {
  const navigate = useNavigate();
  const { search } = Route.useSearch();
  const [sort] = useAtom(drawingsSortOptionAtom);

  const { data: { me: user } = {} } = useSuspenseQuery(GetMeDocument);

  if (!user) throw new Error("No user");

  const setSearch = (search: string | undefined) =>
    navigate({ to: ".", search: (prev) => ({ ...prev, search }) });

  const { data: { folders = [], drawings = [] } = {}, loading } = useQuery(
    GetDrawingsAndFoldersDocument,
    {
      variables: {
        query: {
          sortDirection: sort.direction,
          sortField: sort.field,
          search,
        },
      },
    },
  );

  const isSearching = Boolean(search && search.length > 0);
  const treeNodes = buildTree(isSearching ? [] : folders, drawings);

  return (
    <main className="flex max-w-screen">
      <Sidebar>
        <header className="flex items-center justify-between gap-3 p-3">
          <Link to="/" className="flex items-center gap-2">
            <DraftingCompassIcon className="text-accent-10 size-6" />
            <Heading size="4">Excalidraw Lite</Heading>
          </Link>
          <AddMenu />
        </header>
        <Separator size="4" />
        <div className="flex items-center gap-2 p-3">
          <DrawingListSearch
            search={search}
            setSearch={setSearch}
            drawings={drawings}
          />
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
            <DrawingList
              isSearching={isSearching}
              loading={loading}
              treeNodes={treeNodes}
            />
          </DrawingListProvider>
        </React.Suspense>
        <Separator size="4" />
        <div className="flex items-baseline gap-2 p-3">
          <Progress value={(user.storageUsed / user.storageLimit) * 100} />
          <Text size="1" color="gray">
            {`${formatFileSize(user.storageUsed)} / ${formatFileSize(user.storageLimit)} used`}
          </Text>
        </div>
        <Separator size="4" />
        <UserMenu user={user} />
      </Sidebar>
      <Outlet />
    </main>
  );
}
