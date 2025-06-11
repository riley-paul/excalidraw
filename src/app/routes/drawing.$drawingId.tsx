import useMutations from "@/hooks/use-mutations";
import { qDrawing } from "@/lib/client/queries";
import { Excalidraw, restore, serializeAsJSON } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

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
      excalidrawAPI.updateScene(sceneData);
    }
  }, [excalidrawAPI, drawing.content]);

  return (
    <div className="h-screen w-full">
      <Excalidraw
        key={drawingId}
        excalidrawAPI={setExcalidrawAPI}
        onChange={(elements, appState, files) => {
          const json = serializeAsJSON(elements, appState, files, "local");
          debounce(
            () =>
              updateDrawing.mutate({
                id: drawingId,
                content: json,
              }),
            1000
          )();
        }}
      />
    </div>
  );
}
