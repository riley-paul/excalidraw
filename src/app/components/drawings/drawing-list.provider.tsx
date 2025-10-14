import React, { useState } from "react";

type State = {
  isOverListItem: boolean;
  setIsOverListItem: (isOver: boolean) => void;
  isDragDisabled: boolean;
};

type Props = React.PropsWithChildren<Pick<State, "isDragDisabled">>;

const DrawingListContext = React.createContext<State | undefined>(undefined);

export const DrawingListProvider: React.FC<Props> = ({
  children,
  isDragDisabled,
}) => {
  const [isOverListItem, setIsOverListItem] = useState(false);

  return (
    <DrawingListContext.Provider
      value={{ isOverListItem, setIsOverListItem, isDragDisabled }}
    >
      {children}
    </DrawingListContext.Provider>
  );
};

export const useDrawingListContext = () => {
  const context = React.useContext(DrawingListContext);
  if (!context) {
    throw new Error(
      "useDrawingListContext must be used within a DrawingListProvider",
    );
  }
  return context;
};
