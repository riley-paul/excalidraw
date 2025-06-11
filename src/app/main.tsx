import { Excalidraw } from "@excalidraw/excalidraw";

import React from "react";
import "@excalidraw/excalidraw/index.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

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
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <div className="h-screen w-full">
          <Excalidraw />
        </div>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default App;
