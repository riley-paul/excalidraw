import { IconButton, Kbd, TextField } from "@radix-ui/themes";
import { formatForDisplay, useHotkeys } from "@tanstack/react-hotkeys";
import { SearchIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

type Props = {
  search: string | undefined;
  setSearch: (search: string | undefined) => void;
};

const DrawingListSearch: React.FC<Props> = ({ search, setSearch }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(search ?? "");

  const clearSearch = () => {
    setValue("");
    setSearch(undefined);
    inputRef.current?.blur();
  };

  useEffect(() => setValue(search ?? ""), [search]);

  useHotkeys([
    {
      hotkey: "Escape",
      callback: clearSearch,
      options: { target: inputRef, preventDefault: true },
    },
    {
      hotkey: "Mod+K",
      callback: () => {
        inputRef.current?.focus();
      },
      options: { preventDefault: true },
    },
  ]);

  const setSearchDebounced = useDebounceCallback(setSearch, 500);

  return (
    <TextField.Root
      ref={inputRef}
      placeholder="Search..."
      variant="soft"
      className="flex-1"
      value={value}
      onChange={(e) => {
        const { value } = e.target;
        setValue(e.target.value);
        setSearchDebounced(value.length > 0 ? value : undefined);
      }}
    >
      <TextField.Slot side="left">
        <SearchIcon className="size-4" />
      </TextField.Slot>
      {value ? (
        <TextField.Slot side="right">
          <IconButton
            size="1"
            variant="soft"
            radius="full"
            color="red"
            onClick={clearSearch}
            className="size-5!"
          >
            <span className="sr-only">Clear search</span>
            <XIcon className="size-3" />
          </IconButton>
        </TextField.Slot>
      ) : (
        <TextField.Slot side="right">
          <Kbd variant="soft">{formatForDisplay("Mod+K")}</Kbd>
        </TextField.Slot>
      )}
    </TextField.Root>
  );
};

export default DrawingListSearch;
