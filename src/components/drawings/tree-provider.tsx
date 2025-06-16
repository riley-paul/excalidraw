// provider for the list of tree nodes produced by the `buildTree` function.

import React from "react";
import { buildTree, type TreeNode } from "./tree.utils";
import { qDrawings, qFolders } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const TreeContext = React.createContext<TreeNode[]>([]);

type Props = React.PropsWithChildren;

export const TreeProvider: React.FC<Props> = ({ children }) => {
  const { data: drawings } = useSuspenseQuery(qDrawings);
  const { data: folders } = useSuspenseQuery(qFolders);
  const treeNodes = buildTree(folders, drawings);

  return (
    <TreeContext.Provider value={treeNodes}>{children}</TreeContext.Provider>
  );
};
