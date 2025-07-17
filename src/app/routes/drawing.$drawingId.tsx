import useMutations from "@/hooks/use-mutations";
import {
  Excalidraw,
  exportToBlob,
  Footer,
  restore,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDocumentTitle, useEventListener } from "usehooks-ts";
import { Button, Spinner } from "@radix-ui/themes";
import RadixProvider from "@/components/radix-provider";
import { actions } from "astro:actions";
import { SaveIcon } from "lucide-react";
import useFileTree from "@/hooks/use-file-tree";
import { qDrawing } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import useIsDirtyWorker from "@/hooks/use-is-dirty-worker";

export const Route = createFileRoute("/drawing/$drawingId")({
  component: RouteComponent,
  loader: async ({ params: { drawingId }, context: { queryClient } }) => {
    return queryClient.ensureQueryData(qDrawing(drawingId));
  },
  onError: () => {
    toast.error("Failed to load drawing. Please try again.");
    throw redirect({ to: "/" });
  },
});

function RouteComponent() {
  const { drawingId } = Route.useParams();
  const {
    data: { name, parentFolderId },
  } = useSuspenseQuery(qDrawing(drawingId));
  const { saveDrawing } = useMutations();
  const { openFolder } = useFileTree();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  // Effects
  useDocumentTitle(name);
  useEffect(() => {
    if (!parentFolderId) return;
    openFolder(parentFolderId);
  }, []);

  const { isDirty, setIsDirty, isDirtyOnSave } = useIsDirtyWorker({
    excalidrawAPI,
  });

  const handleSave = async () => {
    if (!excalidrawAPI) return;

    setIsLoading(true);

    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    const contentJson = serializeAsJSON(elements, appState, files, "local");
    const content = new File([contentJson], `${drawingId}.json`, {
      type: "application/json",
    });

    const thumbnailBlobPromise = exportToBlob({
      elements,
      appState,
      files,
    }) as Promise<Blob>;
    const thumbnailBlob = await thumbnailBlobPromise;
    const thumbnail = new File([thumbnailBlob], `${drawingId}.png`, {
      type: "image/png",
    });

    await saveDrawing.mutateAsync({ id: drawingId, content, thumbnail });

    setIsLoading(false);
    isDirtyOnSave();
  };

  useEventListener("keydown", (event) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSave();
    }
  });

  const loadInitialData = async () => {
    const { content } = await actions.drawings.get.orThrow({
      id: drawingId,
      withContent: true,
    });
    setIsDirty(false);
    return restore(JSON.parse(content ?? "{}"), null, null);
  };

  return (
    <div className="h-screen w-full">
      <Excalidraw
        key={drawingId}
        initialData={loadInitialData}
        excalidrawAPI={setExcalidrawAPI}
      >
        <Footer>
          <RadixProvider overrideAppearance="light">
            <div className="ml-3">
              <Button
                onClick={handleSave}
                variant={isDirty ? "solid" : "soft"}
                className="h-[2.25rem]!"
                disabled={isLoading}
              >
                <Spinner loading={isLoading}>
                  <SaveIcon className="size-4" />
                </Spinner>
                Save
              </Button>
            </div>
          </RadixProvider>
        </Footer>
      </Excalidraw>
    </div>
  );
}
