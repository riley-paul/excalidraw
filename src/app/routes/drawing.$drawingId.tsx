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
import { LoaderIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { Button, Spinner } from "@radix-ui/themes";
import RadixProvider from "@/components/radix-provider";

export const Route = createFileRoute("/drawing/$drawingId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const drawing = await context.queryClient.fetchQuery(
      qDrawing(params.drawingId)
    );
    return { drawing };
  },
  onError: () => {
    toast.error("Failed to load drawing. Please try again.");
    throw redirect({ to: "/" });
  },
});

function RouteComponent() {
  const { drawing } = Route.useLoaderData();
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
      const content = new File([contentJson], `${drawing.id}.json`, {
        type: "application/json",
      });

      const thumbnailBlob = (await exportToBlob({
        elements,
        appState,
        files,
      })) as Blob;
      const thumbnail = new File([thumbnailBlob], `${drawing.id}.png`, {
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
        initialData={restore(JSON.parse(drawing.content ?? "{}"), null, null)}
        excalidrawAPI={setExcalidrawAPI}
      >
        <Footer>
          <RadixProvider overrideAppearance="light">
            <Button onClick={handleSave} variant="soft">
              <Spinner loading={saveDrawing.isPending}>
                <SaveIcon className="size-4" />
              </Spinner>
              Save
            </Button>
          </RadixProvider>
        </Footer>
      </Excalidraw>
    </div>
  );
}
