import equal from "fast-deep-equal";
import type {
  AutoSaveMessage,
  AutoSaveResponse,
  DrawingData,
} from "./autoSaveWorker.types";

let lastData: DrawingData | null = null;
let isFirstCheck = true;

self.onmessage = (e: MessageEvent<AutoSaveMessage>) => {
  const { type, payload } = e.data;

  switch (type) {
    case "check": {
      const changed = !equal(payload, lastData) && !isFirstCheck;
      if (changed) lastData = payload;
      isFirstCheck = false;

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
