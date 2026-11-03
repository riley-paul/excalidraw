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


export type GetDrawingsQuery = { drawings: Array<{ id: string, name: string, fileSize: number | null, savedAt: string | null }> };

export type CreateDrawingMutationVariables = Exact<{
  input: CreateDrawingInput;
}>;


export type CreateDrawingMutation = { createDrawing: { id: string, name: string, fileSize: number | null, savedAt: string | null } | null };

export type UserFragment = { id: string, name: string, email: string, avatarUrl: string | null, storageLimit: number, storageUsed: number };

export type ShallowDrawingFragment = { id: string, name: string, fileSize: number | null, savedAt: string | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { me: { id: string, name: string, email: string, avatarUrl: string | null, storageLimit: number, storageUsed: number } };

export type DeleteUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteUserMutation = { deleteUser: boolean };

export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"storageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"storageUsed"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const ShallowDrawingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShallowDrawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"savedAt"}}]}}]} as unknown as DocumentNode<ShallowDrawingFragment, unknown>;
export const GetDrawingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDrawings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingsQueryArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"drawings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShallowDrawing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShallowDrawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"savedAt"}}]}}]} as unknown as DocumentNode<GetDrawingsQuery, GetDrawingsQueryVariables>;
export const CreateDrawingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDrawing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDrawingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDrawing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShallowDrawing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShallowDrawing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DrawingObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"savedAt"}}]}}]} as unknown as DocumentNode<CreateDrawingMutation, CreateDrawingMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserObjectType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"storageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"storageUsed"}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;