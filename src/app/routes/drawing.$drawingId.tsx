import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/drawing/$drawingId")({
  component: RouteComponent,
});

function RouteComponent() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  return (
    <div className="h-screen w-full">
      <Excalidraw excalidrawAPI={setExcalidrawAPI} />
    </div>
  );
}
