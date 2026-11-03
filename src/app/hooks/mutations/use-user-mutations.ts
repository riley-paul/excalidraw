import { DeleteUserDocument } from "@/app/gql.gen";
import { useMutation } from "@apollo/client/react";

export default function useUserMutations() {
  const deleteAccountMutation = useMutation(DeleteUserDocument, {
    onCompleted: () => {
      window.location.reload();
    },
  });

  return { deleteAccountMutation };
}
