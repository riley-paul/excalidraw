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

  const performCheck = () => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    const files = excalidrawAPI.getFiles();

    const message: IsDirtyMessage = {
      type: "check",
      payload: { elements, files },
    };
    workerRef.current?.postMessage(message);
  };

  const updateIsDirtyWorker = () => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    const files = excalidrawAPI.getFiles();

    setIsDirty(false);

    const message: IsDirtyMessage = {
      type: "save",
      payload: { elements, files },
    };
    workerRef.current?.postMessage(message);
  };

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

  // set initial clean baseline after Excalidraw has finished initializing
  useEffect(() => {
    if (!excalidrawAPI) return;
    const id = setTimeout(updateIsDirtyWorker, 1_000);
    return () => clearTimeout(id);
  }, [excalidrawAPI]);

  // set up interval to perform checks
  useInterval(performCheck, checkInterval);

  return { isDirty, updateIsDirtyWorker };
}
