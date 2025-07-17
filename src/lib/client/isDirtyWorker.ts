import equal from "fast-deep-equal";
import type {
  IsDirtyMessage,
  IsDirtyResponse,
  DrawingData,
} from "./isDirtyWorker.types";

let lastData: DrawingData | null = null;
let isFirstCheck = true;

self.onmessage = (e: MessageEvent<IsDirtyMessage>) => {
  const { type, payload } = e.data;

  switch (type) {
    case "check": {
      if (isFirstCheck) {
        lastData = payload;
        isFirstCheck = false;
        const response: IsDirtyResponse = { type, changed: false };
        self.postMessage(response);
        return;
      }

      const changed = !equal(payload, lastData);
      if (changed) lastData = payload;
      const response: IsDirtyResponse = { type, changed };
      self.postMessage(response);
      return;
    }
    case "save": {
      lastData = payload;

      const response: IsDirtyResponse = { type, updated: true };
      self.postMessage(response);
      return;
    }
  }
};
