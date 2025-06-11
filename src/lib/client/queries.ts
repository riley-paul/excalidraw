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
