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

  const deleteDrawingMutation = useMutation(DeleteDrawingDocument, {});

  return {
    createDrawingMutation,
    updateDrawingMutation,
    deleteDrawingMutation,
  };
}
