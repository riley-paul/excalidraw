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

  const updateFolderMutation = useMutation(UpdateFolderDocument, {
    refetchQueries: [GetFoldersDocument, GetDrawingsAndFoldersDocument],
  });

  const deleteFolderMutation = useMutation(DeleteFolderDocument, {
    update: (cache, { data }) => {
      const deletedFolder = data?.deleteFolder;
      if (!deletedFolder) return;

      cache.evict({ id: cache.identify(deletedFolder) });
    },
  });

  return {
    createFolderMutation,
    updateFolderMutation,
    deleteFolderMutation,
  };
}
