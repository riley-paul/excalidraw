import { Excalidraw } from "@excalidraw/excalidraw";

import React, { useState } from "react";
import "@excalidraw/excalidraw/index.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import NavSidebar from "@/components/nav/nav-sidebar";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import DrawingDialog from "@/components/drawing-dialog/drawing-dialog";
import AlertSystem from "@/components/alert-system/alert-system";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error);
      toast.error(error.message ?? "Server Error");
    },
  }),
});

const App: React.FC = () => {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <NavSidebar />
        <div className="h-screen w-full">
          <Excalidraw excalidrawAPI={setExcalidrawAPI} />
        </div>
        <Toaster />
        <DrawingDialog />
        <AlertSystem />
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default App;
