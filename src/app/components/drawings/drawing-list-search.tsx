import { IconButton, Kbd, TextField } from "@radix-ui/themes";
import { formatForDisplay, useHotkeys } from "@tanstack/react-hotkeys";
import { useAtom } from "jotai";
import { SearchIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { drawingsSortOptionAtom } from "./drawing-list.store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qDrawings } from "@/lib/client/queries";
import { searchSelectionIdAtom } from "@/lib/client/store";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  search: string | undefined;
  setSearch: (search: string | undefined) => void;
};

const DrawingListSearch: React.FC<Props> = ({ search, setSearch }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [value, setValue] = useState(search ?? "");
  const [searchSelectionId, setSearchSelectionId] = useAtom(
    searchSelectionIdAtom,
  );

  const clearSearch = () => {
    setValue("");
    setSearch(undefined);
    inputRef.current?.blur();
    setSearchSelectionId(undefined);
  };

  useEffect(() => setValue(search ?? ""), [search]);

  const setSearchDebounced = useDebounceCallback(setSearch, 500);

  const [sort] = useAtom(drawingsSortOptionAtom);
  const { data: drawings } = useSuspenseQuery(qDrawings({ search, sort }));

  useHotkeys([
    {
      hotkey: "Escape",
      callback: clearSearch,
      options: { target: inputRef, preventDefault: true },
    },
    {
      hotkey: "Mod+K",
      callback: () => inputRef.current?.focus(),
      options: { preventDefault: true },
    },
    {
      hotkey: "ArrowDown",
      callback: () => {
        const currentIdx = drawings.findIndex(
          (d) => d.id === searchSelectionId,
        );
        const nextIdx =
          currentIdx === -1 ? 0 : (currentIdx + 1) % drawings.length;
        setSearchSelectionId(drawings[nextIdx]?.id);
      },
      options: { target: inputRef, preventDefault: true },
    },
    {
      hotkey: "ArrowUp",
      callback: () => {
        const currentIdx = drawings.findIndex(
          (d) => d.id === searchSelectionId,
        );
        const nextIdx =
          currentIdx === -1
            ? drawings.length - 1
            : (currentIdx - 1 + drawings.length) % drawings.length;
        setSearchSelectionId(drawings[nextIdx]?.id);
      },
      options: { target: inputRef, preventDefault: true },
    },
    {
      hotkey: "Enter",
      callback: () => {
        if (searchSelectionId)
          navigate({
            to: "/drawing/$drawingId",
            params: { drawingId: searchSelectionId },
            search: true,
          });
      },
      options: { target: inputRef, preventDefault: true },
    },
  ]);

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
        if (value.length === 0) clearSearch();
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
