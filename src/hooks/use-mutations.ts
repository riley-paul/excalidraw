import { qDrawings } from "@/lib/client/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { actions } from "astro:actions";
import { toast } from "sonner";

export default function useMutations() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { drawingId } = useParams({ strict: false });

  const createDrawing = useMutation({
    mutationFn: actions.drawings.create.orThrow,
    onSuccess: ({ id }) => {
      navigate({ to: "/drawing/$drawingId", params: { drawingId: id } });
      queryClient.invalidateQueries({ queryKey: qDrawings.queryKey });
    },
  });

  const removeDrawing = useMutation({
    mutationFn: actions.drawings.remove.orThrow,
    onSuccess: (_, { id }) => {
      if (drawingId === id) navigate({ to: "/" });
      queryClient.invalidateQueries({ queryKey: qDrawings.queryKey });
    },
  });

  const updateDrawing = useMutation({
    mutationFn: actions.drawings.update.orThrow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qDrawings.queryKey });
    },
  });

  const saveDrawing = useMutation({
    mutationFn: (data: { id: string; content: File; thumbnail?: File }) => {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("content", data.content);
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
      return actions.drawings.save.orThrow(formData);
    },
    onSuccess: () => {
      toast.success("Drawing saved successfully!");
    },
  });

  return { createDrawing, removeDrawing, updateDrawing, saveDrawing };
}
