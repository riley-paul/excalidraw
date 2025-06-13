import useMutations from "@/hooks/use-mutations";
import { qDrawing } from "@/lib/client/queries";
import {
  Excalidraw,
  exportToBlob,
  Footer,
  restore,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { Button, Spinner } from "@radix-ui/themes";
import RadixProvider from "@/components/radix-provider";
import { actions } from "astro:actions";

export const Route = createFileRoute("/drawing/$drawingId")({
  component: RouteComponent,
  onError: () => {
    toast.error("Failed to load drawing. Please try again.");
    throw redirect({ to: "/" });
  },
});

function RouteComponent() {
  const { drawingId } = Route.useParams();

  const { saveDrawing } = useMutations();

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const handleSave = async () => {
    if (excalidrawAPI) {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      const contentJson = serializeAsJSON(elements, appState, files, "local");
      const content = new File([contentJson], `${drawingId}.json`, {
        type: "application/json",
      });

      const thumbnailBlob = (await exportToBlob({
        elements,
        appState,
        files,
      })) as Blob;
      const thumbnail = new File([thumbnailBlob], `${drawingId}.png`, {
        type: "image/png",
      });
      saveDrawing.mutate({ id: drawingId, content, thumbnail });
    }
  };

  useEventListener("keydown", (event) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSave();
    }
  });

  return (
    <div className="h-screen w-full">
      <Excalidraw
        key={drawingId}
        initialData={async () => {
          const { content } = await actions.drawings.get.orThrow({
            id: drawingId,
          });
          return restore(JSON.parse(content ?? "{}"), null, null);
        }}
        excalidrawAPI={setExcalidrawAPI}
      >
        <Footer>
          <RadixProvider overrideAppearance="light">
            <div className="ml-3">
              <Button onClick={handleSave} variant="soft" className="h-[2.25rem]!">
                <Spinner loading={saveDrawing.isPending}>
                  <i className="fas fa-save"></i>
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
