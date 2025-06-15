import AppSidebar from "@/components/sidebar/app-sidebar";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Component,
  },
);

function Component() {
  return (
    <div className="flex">
      <AppSidebar />
      <Outlet />
    </div>
  );
}
