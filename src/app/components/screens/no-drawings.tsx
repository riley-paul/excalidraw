import React from "react";
import Empty from "../ui/empty";
import { LineSquiggleIcon } from "lucide-react";

const NoDrawingsScreen: React.FC = () => {
  return (
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <LineSquiggleIcon />
        </Empty.Media>
        <Empty.Title>No Drawings</Empty.Title>
        <Empty.Description>
          You have no drawings yet. Create a new drawing to get started.
        </Empty.Description>
      </Empty.Header>
    </Empty.Root>
  );
};

export default NoDrawingsScreen;
