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
import { Button, Spinner, Text, Tooltip } from "@radix-ui/themes";
import RadixProvider from "@/app/components/ui/radix-provider";
import { actions } from "astro:actions";
import { CheckIcon, SaveIcon } from "lucide-react";
import useFileTree from "@/app/hooks/use-file-tree";
import { qDrawing } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useHotkey } from "@tanstack/react-hotkeys";
import useIsDirtyWorker from "../hooks/use-is-dirty-worker";
import { cn } from "@/lib/client/utils";
import { useBlocker } from "@tanstack/react-router";
import { ignoreDirtyAtom, jotaiStore } from "@/lib/client/store";

type Props = { drawingId: string };

const Drawing: React.FC<Props> = ({ drawingId }) => {
  const { data: drawing } = useSuspenseQuery(qDrawing(drawingId));
  if (!drawing) throw new Error("Drawing not found");

  const { name, parentFolderId } = drawing;

  const { saveDrawing } = useMutations();
  const { openFolder } = useFileTree();

  // State
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  // Effects
  useDocumentTitle(name);
  useEffect(() => {
    if (!parentFolderId) return;
    openFolder(parentFolderId);
  }, []);

  const { isDirty, markAsClean } = useIsDirtyWorker({ excalidrawAPI });

  const handleSave = async () => {
    if (!excalidrawAPI) return;

    setIsSaving(true);

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
      setIsSaving(false);
    }
    markAsClean();
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    const drawing = await actions.drawings.get.orThrow({
      id: drawingId,
      withContent: true,
    });
    if (!drawing) throw new Error("Drawing content not found");
    const data = restore(JSON.parse(drawing.content ?? "{}"), null, null);
    markAsClean();
    setIsLoading(false);
    return data;
  };

  // useInterval(handleSave, isDirty ? null : 1_000 * 60 * 2);

  useBlocker({
    shouldBlockFn: () => {
      const shouldBlock = isDirty && !jotaiStore.get(ignoreDirtyAtom);
      if (!shouldBlock) return false;
      return !confirm("You have unsaved changes. Do you really want to leave?");
    },
    enableBeforeUnload: () => isDirty && !jotaiStore.get(ignoreDirtyAtom),
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
          {!isLoading && (
            <div className="ml-3 flex items-center gap-3">
              <Button
                onClick={handleSave}
                variant={isDirty ? "solid" : "surface"}
                className="h-9!"
                disabled={isSaving}
              >
                <Spinner loading={isSaving}>
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
          )}
        </RadixProvider>
      </Footer>
    </Excalidraw>
  );
};

export default Drawing;
