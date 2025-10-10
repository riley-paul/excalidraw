import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";
import type { DrawingsQueryParams } from "../types";

export const qCurrentUser = queryOptions({
  queryKey: ["currentUser"],
  queryFn: actions.users.getMe.orThrow,
});

export const qDrawings = ({ search, sort }: DrawingsQueryParams) =>
  queryOptions({
    queryKey: ["drawings", search, sort],
    queryFn: () => actions.drawings.list.orThrow({ search, sort }),
  });

export const qFolders = queryOptions({
  queryKey: ["folders"],
  queryFn: actions.folders.list.orThrow,
});

export const qDrawing = (drawingId: string) =>
  queryOptions({
    queryKey: ["drawing", drawingId],
    queryFn: () => actions.drawings.get.orThrow({ id: drawingId }),
  });
