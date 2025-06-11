import { Excalidraw } from "@excalidraw/excalidraw";

import React from "react";
import "@excalidraw/excalidraw/index.css";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import AppSidebar from "./app-sidebar";

const Canvas: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="h-screen w-full relative">
        <SidebarTrigger className="absolute top-16 left-4 z-10" />
        <Excalidraw />
      </div>
    </SidebarProvider>
  );
};

export default Canvas;
