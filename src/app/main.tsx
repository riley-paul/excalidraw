import { Excalidraw } from "@excalidraw/excalidraw";

import React from "react";
import "@excalidraw/excalidraw/index.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

const App: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="h-screen w-full">
        <Excalidraw />
      </div>
    </SidebarProvider>
  );
};

export default App;
