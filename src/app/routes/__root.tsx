import DrawingDialog from "@/components/drawing-dialog/drawing-dialog";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Component,
  },
);

function Component() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Outlet />
      <DrawingDialog />
    </SidebarProvider>
  );
}
