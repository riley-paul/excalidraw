import {
  CreateFolderDocument,
  DeleteFolderDocument,
  GetDrawingsAndFoldersDocument,
  GetFoldersDocument,
  UpdateFolderDocument,
} from "@/app/gql.gen";
import { useMutation } from "@apollo/client/react";

export default function useFolderMutations() {
  const createFolderMutation = useMutation(CreateFolderDocument, {
    refetchQueries: [GetFoldersDocument, GetDrawingsAndFoldersDocument],
  });

  const updateFolderMutation = useMutation(UpdateFolderDocument);

  const deleteFolderMutation = useMutation(DeleteFolderDocument);

  return {
    createFolderMutation,
    updateFolderMutation,
    deleteFolderMutation,
  };
}
