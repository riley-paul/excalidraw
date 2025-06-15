import React from "react";
import DrawingItem from "./drawing-item";
import ScrollShadowWrapper from "@/components/scroll-shadow-wrapper";
import { qDrawings, qFolders } from "@/lib/client/queries";
import { useQuery } from "@tanstack/react-query";
import FolderItem from "./folder-item";

const DrawingList: React.FC = () => {
  const { data: drawings = [] } = useQuery(qDrawings);
  const { data: folders = [] } = useQuery(qFolders);

  return (
    <ScrollShadowWrapper>
      {folders.map((folder) => (
        <FolderItem key={folder.id} folder={folder} />
      ))}
      {drawings.map((drawing) => (
        <DrawingItem key={drawing.id} drawing={drawing} />
      ))}
    </ScrollShadowWrapper>
  );
};

export default DrawingList;
