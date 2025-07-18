import { qDrawing, qDrawings, qFolders } from "@/lib/client/queries";
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
      toast.success("Drawing deleted successfully!");
    },
  });

  const updateDrawing = useMutation({
    mutationFn: actions.drawings.update.orThrow,
    onSuccess: (data) => {
      queryClient.setQueryData(qDrawings.queryKey, (prev) => {
        if (!prev) return prev;
        return prev.map((d) => (d.id === data.id ? { ...d, ...data } : d));
      });
      queryClient.setQueryData(qDrawing(data.id).queryKey, (prev) => {
        if (!prev) return prev;
        return { ...prev, ...data };
      });
    },
  });

  const saveDrawing = useMutation({
    mutationFn: (data: { id: string; content: File; thumbnail: File }) => {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("content", data.content);
      formData.append("thumbnail", data.thumbnail);
      return actions.drawings.save.orThrow(formData);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(qDrawings.queryKey, (prev) => {
        if (!prev) return prev;
        return prev.map((d) => (d.id === data.id ? { ...d, ...data } : d));
      });
      toast.success("Drawing saved successfully!");
    },
  });

  const createFolder = useMutation({
    mutationFn: actions.folders.create.orThrow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qFolders.queryKey });
      toast.success("Folder created successfully!");
    },
  });

  const updateFolder = useMutation({
    mutationFn: actions.folders.update.orThrow,
    onSuccess: (data) => {
      queryClient.setQueryData(qFolders.queryKey, (prev) => {
        if (!prev) return prev;
        return prev.map((f) => (f.id === data.id ? { ...f, ...data } : f));
      });
    },
  });

  const removeFolder = useMutation({
    mutationFn: actions.folders.remove.orThrow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qFolders.queryKey });
      queryClient.invalidateQueries({ queryKey: qDrawings.queryKey });
      toast.success("Folder deleted successfully!");
    },
  });

  return {
    createDrawing,
    removeDrawing,
    updateDrawing,
    saveDrawing,
    createFolder,
    updateFolder,
    removeFolder,
  };
}
