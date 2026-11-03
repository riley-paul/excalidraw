import {
  CreateDrawingDocument,
  DeleteDrawingDocument,
  GetDrawingsAndFoldersDocument,
  GetDrawingsDocument,
  UpdateDrawingDocument,
} from "@/app/gql.gen";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "@tanstack/react-router";

export default function useDrawingMutations() {
  const router = useRouter();

  const createDrawingMutation = useMutation(CreateDrawingDocument, {
    refetchQueries: [GetDrawingsDocument, GetDrawingsAndFoldersDocument],
    onCompleted: (data) => {
      const newDrawingId = data.createDrawing?.id;
      if (!newDrawingId) return;
      router.invalidate();
      router.navigate({
        to: "/drawing/$drawingId",
        params: { drawingId: newDrawingId },
      });
    },
  });

  const updateDrawingMutation = useMutation(UpdateDrawingDocument, {});

  // const saveDrawing = useMutation({
  //   mutationFn: (data: { id: string; content: File; thumbnail: File }) => {
  //     const formData = new FormData();
  //     formData.append("id", data.id);
  //     formData.append("content", data.content);
  //     formData.append("thumbnail", data.thumbnail);
  //     return actions.drawings.save.orThrow(formData);
  //   },
  //   onSuccess: (data) => {
  //     queryClient.setQueriesData<DrawingSelect[]>(
  //       { queryKey: drawingsQueriesKey },
  //       (prev) => {
  //         if (!prev) return prev;
  //         return prev.map((d) => (d.id === data.id ? { ...d, ...data } : d));
  //       },
  //     );
  //     queryClient.invalidateQueries({ queryKey: qCurrentUser.queryKey });
  //     toast.success("Drawing saved successfully!");
  //   },
  // });

  const deleteDrawingMutation = useMutation(DeleteDrawingDocument, {
    update: (cache, { data }) => {
      const deletedDrawing = data?.deleteDrawing;
      if (!deletedDrawing) return;

      cache.evict({ id: cache.identify(deletedDrawing) });
    },
  });

  return {
    createDrawingMutation,
    updateDrawingMutation,
    deleteDrawingMutation,
  };
}
