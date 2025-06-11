import DrawingDialog from "@/components/drawing-dialog/drawing-dialog";
import NavSidebar from "@/components/nav/nav-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Component,
  }
);

function Component() {
  return (
    <SidebarProvider>
      <NavSidebar />
      <Outlet />
      <DrawingDialog />
    </SidebarProvider>
  );
}
