import {
  CreateFolderDocument,
  DeleteFolderDocument,
  UpdateFolderDocument,
} from "@/app/gql.gen";
import { useMutation } from "@apollo/client/react";

export default function useFolderMutations() {
  const createFolderMutation = useMutation(CreateFolderDocument);
  const updateFolderMutation = useMutation(UpdateFolderDocument);
  const deleteFolderMutation = useMutation(DeleteFolderDocument);

  return {
    createFolderMutation,
    updateFolderMutation,
    deleteFolderMutation,
  };
}
