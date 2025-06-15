import type { FolderSelect } from "@/lib/types";
import React from "react";

type Props = {
  folder: FolderSelect;
};

const FolderItem: React.FC<Props> = ({ folder }) => {
  return <div>{folder.name}</div>;
};

export default FolderItem;
