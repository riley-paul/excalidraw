import {
  CreateDrawingDocument,
  DeleteDrawingDocument,
  DuplicateDrawingDocument,
  GetDrawingsAndFoldersDocument,
  GetDrawingsDocument,
  GetMeDocument,
  UpdateDrawingDocument,
  type DrawingFragment,
} from "@/app/gql.gen";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "@tanstack/react-router";
import { actions } from "astro:actions";
import { toast } from "sonner";

export default function useDrawingMutations() {
  const router = useRouter();
  const { cache } = useApolloClient();
  const currentDrawingId = useParams({
    strict: false,
    select: (s) => s.drawingId,
  });

  const createDrawingMutation = useMutation(CreateDrawingDocument, {
    refetchQueries: [
      GetDrawingsDocument,
      GetDrawingsAndFoldersDocument,
      GetMeDocument,
    ],
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

  const updateDrawingMutation = useMutation(UpdateDrawingDocument, {
    refetchQueries: [GetDrawingsDocument, GetDrawingsAndFoldersDocument],
  });

  const deleteDrawingMutation = useMutation(DeleteDrawingDocument, {
    refetchQueries: [GetMeDocument],
    update: (cache, { data }) => {
      const deletedDrawing = data?.deleteDrawing;
      if (!deletedDrawing) return;

      cache.evict({ id: cache.identify(deletedDrawing) });
    },
    onCompleted: (data) => {
      const deletedDrawingId = data.deleteDrawing?.id;
      if (!deletedDrawingId) return;

      if (currentDrawingId === deletedDrawingId) {
        router.invalidate();
        router.navigate({ to: "/" });
      }
    },
  });

  const saveDrawing = async (data: {
    drawingId: string;
    content: File;
    thumbnail: File;
  }) => {
    const formData = new FormData();
    formData.append("drawingId", data.drawingId);
    formData.append("content", data.content);
    formData.append("thumbnail", data.thumbnail);
    const response = await actions.saveDrawing.orThrow(formData);

    cache.modify<DrawingFragment>({
      id: cache.identify({
        __typename: "DrawingObjectType",
        id: data.drawingId,
      }),
      fields: {
        savedAt: () => response.savedAt,
        updatedAt: () => response.updatedAt,
        fileSize: () => response.fileSize,
      },
    });

    toast.success("Drawing saved successfully!");
  };

  const duplicateDrawingMutation = useMutation(DuplicateDrawingDocument, {
    refetchQueries: [
      GetDrawingsDocument,
      GetDrawingsAndFoldersDocument,
      GetMeDocument,
    ],
    onCompleted: (data) => {
      const newDrawingId = data.duplicateDrawing?.id;
      if (!newDrawingId) return;
      router.invalidate();
      router.navigate({
        to: "/drawing/$drawingId",
        params: { drawingId: newDrawingId },
      });
    },
  });

  return {
    createDrawingMutation,
    updateDrawingMutation,
    deleteDrawingMutation,
    duplicateDrawingMutation,
    saveDrawing,
  };
}
