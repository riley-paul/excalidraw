import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import React from "react";
import "@excalidraw/excalidraw/index.css";
import AlertSystem from "@/app/components/alert-system/alert-system";
import RadixProvider from "@/app/components/ui/radix-provider";
import CustomToaster from "@/app/components/ui/custom-toaster";
import LoadingScreen from "./components/screens/loading";
import NotFoundScreen from "./components/screens/not-found";
import ErrorScreen from "./components/screens/error";
import { Provider } from "jotai";
import { jotaiStore } from "@/app/lib/store";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  onlineSource,
  RefetchEventManager,
  windowFocusSource,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "/graphql", useGETForQueries: true }),
  cache: new InMemoryCache(),
  refetchEventManager: new RefetchEventManager({
    sources: {
      online: onlineSource,
      windowFocus: windowFocusSource,
    },
  }),
});

const router = createRouter({
  routeTree,
  context: { apolloClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultPendingComponent: LoadingScreen,
  defaultNotFoundComponent: NotFoundScreen,
  defaultErrorComponent: ErrorScreen,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={jotaiStore}>
        <RadixProvider>
          <RouterProvider router={router} />
          <CustomToaster />
          <AlertSystem />
        </RadixProvider>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
