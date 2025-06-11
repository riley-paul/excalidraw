import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const qCurrentUser = queryOptions({
  queryKey: ["currentUser"],
  queryFn: actions.users.getMe.orThrow,
  staleTime: 1000 * 60 * 5, // 5 minutes
});
