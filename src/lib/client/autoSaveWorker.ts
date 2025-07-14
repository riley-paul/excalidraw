import equal from "fast-deep-equal";
import type {
  AutoSaveMessage,
  AutoSaveResponse,
  DrawingData,
} from "./autoSaveWorker.types";

let lastData: DrawingData | null = null;

self.onmessage = (e: MessageEvent<AutoSaveMessage>) => {
  const { type, payload } = e.data;

  switch (type) {
    case "check": {
      const changed = !equal(payload, lastData);
      if (changed) lastData = payload;

      const response: AutoSaveResponse = { type, changed };
      self.postMessage(response);
      return;
    }
    case "save": {
      lastData = payload;

      const response: AutoSaveResponse = { type, updated: true };
      self.postMessage(response);
      return;
    }
  }
};
