import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const qCurrentUser = queryOptions({
  queryKey: ["currentUser"],
  queryFn: actions.users.getMe.orThrow,
});

export const qDrawings = queryOptions({
  queryKey: ["drawings"],
  queryFn: actions.drawings.list.orThrow,
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
