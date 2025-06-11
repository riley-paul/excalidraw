import { qDrawings } from "@/lib/client/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";

export default function useMutations() {
  const queryClient = useQueryClient();

  const createDrawing = useMutation({
    mutationFn: actions.drawings.create.orThrow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qDrawings.queryKey });
    },
  });

  const removeDrawing = useMutation({
    mutationFn: actions.drawings.remove.orThrow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qDrawings.queryKey });
    },
  });

  const updateDrawing = useMutation({
    mutationFn: actions.drawings.update.orThrow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qDrawings.queryKey });
    },
  });

  return { createDrawing, removeDrawing, updateDrawing };
}
