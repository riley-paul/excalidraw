import { IconButton, TextField } from "@radix-ui/themes";
import { SearchIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

type Props = { search: string; setSearch: (search: string) => void };

const DrawingListSearch: React.FC<Props> = ({ search, setSearch }) => {
  const [value, setValue] = useState(search);

  useEffect(() => setValue(search), [search]);

  const setSearchDebounced = useDebounceCallback(setSearch, 500);

  return (
    <TextField.Root
      placeholder="Search..."
      variant="soft"
      className="flex-1"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        setSearchDebounced(e.target.value);
      }}
    >
      <TextField.Slot side="left">
        <SearchIcon className="size-4" />
      </TextField.Slot>
      {value && (
        <TextField.Slot side="right">
          <IconButton
            size="1"
            variant="soft"
            radius="full"
            color="red"
            onClick={() => {
              setValue("");
              setSearch("");
            }}
          >
            <span className="sr-only">Clear search</span>
            <XIcon className="size-3" />
          </IconButton>
        </TextField.Slot>
      )}
    </TextField.Root>
  );
};

export default DrawingListSearch;
