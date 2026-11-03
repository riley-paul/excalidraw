/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateDrawingInput = {
  name: string;
  parentFolderId?: string | null | undefined;
};

export type DrawingsQueryArgs = {
  search?: string | null | undefined;
  sortDirection?: SortDirection | null | undefined;
  sortField?: DrawingsSortField | null | undefined;
};

export type DrawingsSortField =
  | 'createdAt'
  | 'fileSize'
  | 'name'
  | 'updatedAt';

export type SortDirection =
  | 'asc'
  | 'desc';

export type GetDrawingsQueryVariables = Exact<{
  query?: DrawingsQueryArgs | null | undefined;
}>;


export type GetDrawingsQuery = { drawings: Array<{ id: string, name: string, parentFolderId: string | null, fileSize: number | null, savedAt: string | null, updatedAt: string }> };

export type GetDrawingQueryVariables = Exact<{
  drawingId: string | number;
}>;


export type GetDrawingQuery = { drawing: { content: string | null, id: string, name: string, parentFolderId: string | null, fileSize: number | null, savedAt: string | null, updatedAt: string } | null };

export type CreateDrawingMutationVariables = Exact<{
  input: CreateDrawingInput;
}>;


export type CreateDrawingMutation = { createDrawing: { id: string, name: string, parentFolderId: string | null, fileSize: number | null, savedAt: string | null, updatedAt: string } | null };

export type GetFoldersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFoldersQuery = { folders: Array<{ id: string, name: string, parentFolderId: string | null }> };

export type GetDrawingsAndFoldersQueryVariables = Exact<{
  query?: DrawingsQueryArgs | null | undefined;
}>;


export type GetDrawingsAndFoldersQuery = { drawings: Array<{ id: string, name: string, parentFolderId: string | null, fileSize: number | null, savedAt: string | null, updatedAt: string }>, folders: Array<{ id: string, name: string, parentFolderId: string | null }> };

export type UserFragment = { id: string, name: string, email: string, avatarUrl: string | null, storageLimit: number, storageUsed: number };

export type ShallowDrawingFragment = { id: string, name: string, parentFolderId: string | null, fileSize: number | null, savedAt: string | null, updatedAt: string };

export type DrawingFragment = { content: string | null, id: string, name: string, parentFolderId: string | null, fileSize: number | null, savedAt: string | null, updatedAt: string };

export type FolderFragment = { id: string, name: string, parentFolderId: string | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { me: { id: string, name: string, email: string, avatarUrl: string | null, storageLimit: number, storageUsed: number } };

export type DeleteUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteUserMutation = { deleteUser: boolean };

export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"storageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"storageUsed"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const ShallowDrawingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShallowDrawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"savedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ShallowDrawingFragment, unknown>;
export const DrawingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Drawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShallowDrawing"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShallowDrawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"savedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<DrawingFragment, unknown>;
export const FolderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Folder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FolderObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}}]}}]} as unknown as DocumentNode<FolderFragment, unknown>;
export const GetDrawingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDrawings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingsQueryArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"drawings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShallowDrawing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShallowDrawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"savedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetDrawingsQuery, GetDrawingsQueryVariables>;
export const GetDrawingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDrawing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"drawingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"drawing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"drawingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"drawingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Drawing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShallowDrawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"savedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Drawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShallowDrawing"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]} as unknown as DocumentNode<GetDrawingQuery, GetDrawingQueryVariables>;
export const CreateDrawingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDrawing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDrawingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDrawing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShallowDrawing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShallowDrawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"savedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateDrawingMutation, CreateDrawingMutationVariables>;
export const GetFoldersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFolders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Folder"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Folder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FolderObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}}]}}]} as unknown as DocumentNode<GetFoldersQuery, GetFoldersQueryVariables>;
export const GetDrawingsAndFoldersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDrawingsAndFolders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingsQueryArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"drawings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShallowDrawing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Folder"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShallowDrawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"savedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Folder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FolderObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}}]}}]} as unknown as DocumentNode<GetDrawingsAndFoldersQuery, GetDrawingsAndFoldersQueryVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"storageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"storageUsed"}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;