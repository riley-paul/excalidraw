import useMutations from "@/app/hooks/use-mutations";
import {
  Excalidraw,
  exportToBlob,
  Footer,
  restore,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useEffect, useState } from "react";
import { useDocumentTitle } from "usehooks-ts";
import { Button, Spinner, Text } from "@radix-ui/themes";
import RadixProvider from "@/app/components/ui/radix-provider";
import { actions } from "astro:actions";
import { SaveIcon } from "lucide-react";
import useFileTree from "@/app/hooks/use-file-tree";
import { qDrawing } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useHotkey } from "@tanstack/react-hotkeys";
import useIsDirtyWorker from "../hooks/use-is-dirty-worker";
import { cn } from "@/lib/client/utils";
import { useBlocker } from "@tanstack/react-router";

type Props = { drawingId: string };

const Drawing: React.FC<Props> = ({ drawingId }) => {
  const { data: drawing } = useSuspenseQuery(qDrawing(drawingId));
  if (!drawing) throw new Error("Drawing not found");

  const { name, parentFolderId } = drawing;

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

  const { isDirty, updateIsDirtyWorker } = useIsDirtyWorker({ excalidrawAPI });

  const handleSave = async () => {
    if (!excalidrawAPI) return;

    setIsLoading(true);

    try {
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
    } catch (e) {
      console.error("Error saving drawing:", e);
    } finally {
      setIsLoading(false);
    }
    updateIsDirtyWorker();
  };

  const loadInitialData = async () => {
    const drawing = await actions.drawings.get.orThrow({
      id: drawingId,
      withContent: true,
    });
    if (!drawing) throw new Error("Drawing content not found");
    const data = restore(JSON.parse(drawing.content ?? "{}"), null, null);
    updateIsDirtyWorker();
    return data;
  };

  // useInterval(handleSave, isDirty ? null : 1_000 * 60 * 2);

  useBlocker({
    shouldBlockFn: () => {
      if (!isDirty) return false;
      return !confirm("You have unsaved changes. Do you really want to leave?");
    },
    enableBeforeUnload: () => isDirty,
  });

  useHotkey("Mod+S", handleSave);

  return (
    <Excalidraw
      key={drawingId}
      initialData={loadInitialData}
      excalidrawAPI={setExcalidrawAPI}
    >
      <Footer>
        <RadixProvider appearance="light">
          <div className="ml-3 flex items-center gap-3">
            <Button
              onClick={handleSave}
              variant={isDirty ? "solid" : "surface"}
              className="h-9!"
              disabled={isLoading}
            >
              <Spinner loading={isLoading}>
                <SaveIcon className="size-4" />
              </Spinner>
              Save
            </Button>
            <span className="flex items-center gap-1.5">
              <div
                className={cn(
                  "size-2 rounded-full",
                  isDirty ? "bg-amber-9" : "bg-green-9",
                )}
              />
              <Text size="2" color="gray">
                {isDirty ? "Unsaved changes" : "All changes saved"}
              </Text>
            </span>
          </div>
        </RadixProvider>
      </Footer>
    </Excalidraw>
  );
};

export default Drawing;
