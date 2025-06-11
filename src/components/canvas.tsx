import { Excalidraw } from "@excalidraw/excalidraw";

import React from "react";
import "@excalidraw/excalidraw/index.css";
import { SidebarProvider } from "./ui/sidebar";
import AppSidebar from "./app-sidebar";

const Canvas: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="h-screen w-full">
        <Excalidraw />
      </div>
    </SidebarProvider>
  );
};

export default Canvas;
