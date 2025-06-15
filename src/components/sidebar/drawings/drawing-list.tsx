import React from "react";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "../../drawing-dialog/drawing-dialog.store";
import type { DrawingSelect } from "@/lib/types";
import DrawingItem from "./drawing-item";
import { Button, DropdownMenu, Heading } from "@radix-ui/themes";
import ScrollShadowWrapper from "@/components/scroll-shadow-wrapper";

type Props = {
  drawings: DrawingSelect[];
};

const DrawingList: React.FC<Props> = ({ drawings }) => {
  const [, dispatchDrawingDialog] = useAtom(drawingDialogAtom);
  return (
    <ScrollShadowWrapper>
      {drawings.map((drawing) => (
        <DrawingItem key={drawing.id} drawing={drawing} />
      ))}
    </ScrollShadowWrapper>
  );
};

export default DrawingList;
