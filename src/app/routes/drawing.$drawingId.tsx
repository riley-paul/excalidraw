import useMutations from "@/hooks/use-mutations";
import { qDrawing } from "@/lib/client/queries";
import {
  Excalidraw,
  Footer,
  restore,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/drawing/$drawingId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    try {
      const drawing = await context.queryClient.fetchQuery(
        qDrawing(params.drawingId)
      );
      return { drawing };
    } catch (error) {
      console.error("Error fetching drawing:", error);
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  const { drawing } = Route.useLoaderData();
  const { drawingId } = Route.useParams();

  const { updateDrawing } = useMutations();

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  useEffect(() => {
    if (excalidrawAPI) {
      const sceneData = restore(drawing.content, null, null);
      console.log("Restored scene data:", sceneData);
      excalidrawAPI.updateScene(sceneData);
    }
  }, [excalidrawAPI, drawing.content]);

  const saveDrawing = () => {
    if (excalidrawAPI) {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      const json = serializeAsJSON(elements, appState, files, "local");
      updateDrawing.mutate(
        { id: drawingId, content: JSON.parse(json) },
        {
          onSuccess: () => toast.success("Drawing saved successfully!"),
        }
      );
    }
  };

  return (
    <div className="h-screen w-full">
      <Excalidraw
        key={drawingId}
        initialData={restore(drawing.content, null, null)}
        excalidrawAPI={setExcalidrawAPI}
      >
        <Footer>
          <Button onClick={saveDrawing} className="ml-3">
            <SaveIcon />
            Save
          </Button>
        </Footer>
      </Excalidraw>
    </div>
  );
}
