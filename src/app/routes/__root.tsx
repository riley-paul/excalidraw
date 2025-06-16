import AppSidebar from "@/components/sidebar/app-sidebar";
import { qDrawings, qFolders } from "@/lib/client/queries";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Component,
    loader: async ({ context }) =>
      Promise.all([
        context.queryClient.ensureQueryData(qFolders),
        context.queryClient.ensureQueryData(qDrawings),
      ]),
  },
);

function Component() {
  return (
    <main className="flex">
      <AppSidebar />
      <Outlet />
    </main>
  );
}
