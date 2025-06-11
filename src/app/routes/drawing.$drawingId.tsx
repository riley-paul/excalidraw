import useMutations from "@/hooks/use-mutations";
import { qDrawing } from "@/lib/client/queries";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

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
  const {
    drawing: { elements },
  } = Route.useLoaderData();
  const { drawingId } = Route.useParams();

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const { updateDrawing } = useMutations();

  useInterval(() => {
    if (excalidrawAPI) {
      const elements = excalidrawAPI.getSceneElements();
      updateDrawing.mutate({ elements, id: drawingId });
    }
  }, 5_000);

  return (
    <div className="h-screen w-full">
      <Excalidraw initialData={{ elements }} excalidrawAPI={setExcalidrawAPI} />
    </div>
  );
}
