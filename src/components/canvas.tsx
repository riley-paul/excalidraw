import { Excalidraw } from "@excalidraw/excalidraw";

import React from "react";
import "@excalidraw/excalidraw/index.css";

const Canvas: React.FC = () => {
  return (
    <div className="h-screen">
      <Excalidraw />
    </div>
  );
};

export default Canvas;
