import useMutations from "@/hooks/use-mutations";
import { qDrawing } from "@/lib/client/queries";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { dequal } from "dequal";

export const Route = createFileRoute("/drawing/$drawingId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const drawing = await context.queryClient.fetchQuery(
      qDrawing(params.drawingId)
    );
    return { drawing };
  },
});

function RouteComponent() {
  const { drawing } = Route.useLoaderData();
  const { drawingId } = Route.useParams();

  const [elements, setElements] = useState(drawing.elements);

  const { updateDrawing } = useMutations();

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const saveElements = () => {
    if (!excalidrawAPI) return;
    const newElements = excalidrawAPI.getSceneElements();
    if (dequal(newElements, elements)) return;
    setElements(newElements);
    updateDrawing.mutate({
      id: drawingId,
      elements: newElements,
    });
  };

  return (
    <div className="h-screen w-full">
      <Excalidraw
        key={drawingId}
        excalidrawAPI={setExcalidrawAPI}
        initialData={{ elements: drawing.elements }}
        onChange={saveElements}
      />
    </div>
  );
}
