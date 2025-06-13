import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import React from "react";
import "@excalidraw/excalidraw/index.css";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import AlertSystem from "@/components/alert-system/alert-system";
import RadixProvider from "@/components/radix-provider";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error);
      toast.error(error.message ?? "Server Error");
    },
  }),
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RadixProvider>
        <RouterProvider router={router} />
        <Toaster />
        <AlertSystem />
      </RadixProvider>
    </QueryClientProvider>
  );
};

export default App;
