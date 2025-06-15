import type { ActionHandler } from "astro:actions";
import type folderInputs from "./folders.inputs";
import type { FolderSelect } from "@/lib/types";
import { createDb } from "@/db";
import { isAuthorized } from "../helpers";
import { Folder } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

const list: ActionHandler<typeof folderInputs.list, FolderSelect[]> = async (
  _,
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const folders = await db
    .select()
    .from(Folder)
    .where(eq(Folder.userId, userId))
    .orderBy(asc(Folder.name));
  return folders;
};

const create: ActionHandler<typeof folderInputs.create, FolderSelect> = async (
  { name, parentFolderId },
  c,
) => {
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

const folderHanlders = { list, create };
export default folderHanlders;
