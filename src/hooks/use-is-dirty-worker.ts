import { useEffect, useRef, useState } from "react";
import IsDirtyWorker from "@/lib/client/isDirtyWorker?worker";
import type {
  IsDirtyMessage,
  IsDirtyResponse,
} from "@/lib/client/isDirtyWorker.types";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useInterval } from "usehooks-ts";

type Props = {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  checkInterval?: number;
};

export default function useIsDirtyWorker({
  excalidrawAPI,
  checkInterval = 5_000,
}: Props) {
  const workerRef = useRef<Worker>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const worker = new IsDirtyWorker();
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<IsDirtyResponse>) => {
      switch (e.data.type) {
        case "check": {
          if (e.data.changed) setIsDirty(true);
          return;
        }
      }
    };

    return () => worker.terminate();
  }, []);

  // Check for changes every 5 seconds
  useInterval(() => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    const message: IsDirtyMessage = {
      type: "check",
      payload: { elements, appState, files },
    };
    workerRef.current?.postMessage(message);
  }, checkInterval);

  const isDirtyOnSave = () => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    setIsDirty(false);

    const message: IsDirtyMessage = {
      type: "save",
      payload: { elements, appState, files },
    };
    workerRef.current?.postMessage(message);
  };

  return { isDirty, setIsDirty, isDirtyOnSave };
}
