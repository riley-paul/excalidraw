import React from "react";
import Empty from "../ui/empty";
import { SearchXIcon } from "lucide-react";
import { Button } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";

const NoSearchResultsScreen: React.FC = () => {
  return (
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <SearchXIcon />
        </Empty.Media>
        <Empty.Title>No Search Results</Empty.Title>
        <Empty.Description>
          We couldn't find any drawings matching your search criteria. Try
          adjusting your search or clearing the search to see all drawings.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button variant="soft">
          <Link to="." search={(prev) => ({ ...prev, search: undefined })}>
            <span>Clear Search</span>
          </Link>
        </Button>
      </Empty.Content>
    </Empty.Root>
  );
};

export default NoSearchResultsScreen;
