import React from "react";
import DrawingItem from "./drawing-item";
import ScrollShadowWrapper from "@/components/scroll-shadow-wrapper";
import { qDrawings, qFolders } from "@/lib/client/queries";
import { useQuery } from "@tanstack/react-query";

const DrawingList: React.FC = () => {
  const { data: drawings = [] } = useQuery(qDrawings);
  const { data: folders = [] } = useQuery(qFolders);

  return (
    <ScrollShadowWrapper>
      {drawings.map((drawing) => (
        <DrawingItem key={drawing.id} drawing={drawing} />
      ))}
    </ScrollShadowWrapper>
  );
};

export default DrawingList;
