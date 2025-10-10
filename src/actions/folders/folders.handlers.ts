import type { ActionHandler } from "astro:actions";
import * as folderInputs from "./folders.inputs";
import type { FolderSelect } from "@/lib/types";
import { createDb } from "@/db";
import { isAuthorized } from "../helpers";
import { Folder } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";

export const list: ActionHandler<
  typeof folderInputs.list,
  FolderSelect[]
> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const folders = await db
    .select()
    .from(Folder)
    .where(eq(Folder.userId, userId))
    .orderBy(asc(Folder.name));
  return folders;
};

export const create: ActionHandler<
  typeof folderInputs.create,
  FolderSelect
> = async ({ name, parentFolderId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [newFolder] = await db
    .insert(Folder)
    .values({
      userId,
      name,
      parentFolderId,
    })
    .returning();

  return newFolder;
};

export const update: ActionHandler<
  typeof folderInputs.update,
  FolderSelect
> = async ({ id, name, parentFolderId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [updatedFolder] = await db
    .update(Folder)
    .set({
      name,
      parentFolderId,
    })
    .where(and(eq(Folder.id, id), eq(Folder.userId, userId)))
    .returning();

  if (!updatedFolder) {
    throw new Error(
      "Folder not found or you do not have permission to update it.",
    );
  }
  return updatedFolder;
};

export const remove: ActionHandler<
  typeof folderInputs.remove,
  boolean
> = async ({ id }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const result = await db
    .delete(Folder)
    .where(and(eq(Folder.id, id), eq(Folder.userId, userId)));

  if (result.rowsAffected === 0) {
    throw new Error(
      "Folder not found or you do not have permission to delete it.",
    );
  }
  return true;
};
