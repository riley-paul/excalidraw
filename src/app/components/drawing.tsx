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
import { useDocumentTitle, useEventListener } from "usehooks-ts";
import { Button, Spinner } from "@radix-ui/themes";
import RadixProvider from "@/app/components/ui/radix-provider";
import { actions } from "astro:actions";
import { SaveIcon } from "lucide-react";
import useFileTree from "@/app/hooks/use-file-tree";
import { qDrawing } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";

type Props = {
  drawingId: string;
};

const Drawing: React.FC<Props> = ({ drawingId }) => {
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

  // const { isDirty, updateIsDirtyWorker } = useIsDirtyWorker({ excalidrawAPI });

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
    // updateIsDirtyWorker();
  };

  const loadInitialData = async () => {
    const { content } = await actions.drawings.get.orThrow({
      id: drawingId,
      withContent: true,
    });
    const data = restore(JSON.parse(content ?? "{}"), null, null);
    // updateIsDirtyWorker();
    return data;
  };

  // useInterval(handleSave, isDirty ? null : 1_000 * 60 * 2);

  // useBlocker({
  //   shouldBlockFn: () => {
  //     if (!isDirty) return false;
  //     const confirmMessage =
  //       "You have unsaved changes. Do you really want to leave?";
  //     return !confirm(confirmMessage);
  //   },
  //   enableBeforeUnload: () => isDirty,
  // });

  useEventListener("keydown", (event) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSave();
    }
  });

  return (
    <Excalidraw
      key={drawingId}
      initialData={loadInitialData}
      excalidrawAPI={setExcalidrawAPI}
    >
      <Footer>
        <RadixProvider appearance="light">
          <div className="ml-3">
            <Button
              onClick={handleSave}
              // variant={isDirty ? "solid" : "soft"}
              variant="soft"
              className="h-[2.25rem]"
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
  );
};

export default Drawing;
