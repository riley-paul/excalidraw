import DrawingDialog from "@/components/drawing-dialog/drawing-dialog";
import NavSidebar from "@/components/nav/nav-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  return (
    <SidebarProvider>
      <NavSidebar />
      <div className="h-screen w-full">
        <Excalidraw excalidrawAPI={setExcalidrawAPI} />
      </div>
      <DrawingDialog />
    </SidebarProvider>
  );
}
