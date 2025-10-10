import { ActionError, type ActionHandler } from "astro:actions";
import * as drawingInputs from "./drawings.inputs";
import type {
  DrawingSelect,
  DrawingSelectWithContent,
  DrawingSortField,
  DrawingSortOption,
} from "@/lib/types";
import { createDb } from "@/db";
import { isAuthorized } from "../helpers";
import { Drawing } from "@/db/schema";
import { and, asc, desc, eq, like, or } from "drizzle-orm";

export const get: ActionHandler<
  typeof drawingInputs.get,
  DrawingSelectWithContent
> = async ({ id, withContent }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [drawing] = await db
    .select()
    .from(Drawing)
    .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)));

  if (!drawing) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: `Drawing with id ${id} not found.`,
    });
  }

  if (!withContent) {
    return { ...drawing, content: null };
  }

  const content = await c.locals.runtime.env.R2_BUCKET.get(id);
  return { ...drawing, content: content ? await content.text() : null };
};

const LIST_SORT_MAPPING: Record<DrawingSortField, any> = {
  name: Drawing.name,
  updatedAt: Drawing.savedAt,
  createdAt: Drawing.createdAt,
  fileSize: Drawing.fileSize,
};

const getOrderBy = (sort: DrawingSortOption | undefined) => {
  if (!sort) return desc(Drawing.createdAt);
  const sortField = LIST_SORT_MAPPING[sort.field] || Drawing.createdAt;
  return sort.direction === "asc" ? asc(sortField) : desc(sortField);
};

const getSearch = (search: string | undefined) => {
  if (!search) return undefined;
  const searchTerm = `%${search}%`;
  return or(like(Drawing.name, searchTerm));
};

export const list: ActionHandler<
  typeof drawingInputs.list,
  DrawingSelect[]
> = async ({ sort, search }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const drawings = await db
    .select()
    .from(Drawing)
    .where(and(eq(Drawing.userId, userId), getSearch(search)))
    .orderBy(getOrderBy(sort));

  return drawings;
};

export const create: ActionHandler<
  typeof drawingInputs.create,
  DrawingSelect
> = async (data, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [newDrawing] = await db
    .insert(Drawing)
    .values({ ...data, userId })
    .returning();
  return newDrawing;
};

export const update: ActionHandler<
  typeof drawingInputs.update,
  DrawingSelect
> = async ({ id, ...updateData }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [updatedDrawing] = await db
    .update(Drawing)
    .set(updateData)
    .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)))
    .returning();

  if (!updatedDrawing) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: `Drawing with id ${id} not found.`,
    });
  }

  return updatedDrawing;
};

export const remove: ActionHandler<
  typeof drawingInputs.remove,
  boolean
> = async ({ id }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const result = await db
    .delete(Drawing)
    .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)));

  if (result.rowsAffected === 0) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: `Drawing with id ${id} not found.`,
    });
  }

  await c.locals.runtime.env.R2_BUCKET.delete(id);
  await c.locals.runtime.env.R2_BUCKET.delete(`${id}-thumbnail`);

  return true;
};

export const save: ActionHandler<
  typeof drawingInputs.save,
  DrawingSelect
> = async ({ id, content, thumbnail }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [drawing] = await db
    .select()
    .from(Drawing)
    .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)));

  if (!drawing) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: `Drawing with id ${id} not found.`,
    });
  }

  await Promise.all([
    c.locals.runtime.env.R2_BUCKET.put(id, content),
    c.locals.runtime.env.R2_BUCKET.put(`${id}-thumbnail`, thumbnail),
  ]);

  const [updated] = await db
    .update(Drawing)
    .set({ savedAt: new Date().toISOString(), fileSize: content.size })
    .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)))
    .returning();

  return updated;
};

export const duplicate: ActionHandler<
  typeof drawingInputs.duplicate,
  DrawingSelect
> = async ({ id }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [drawing] = await db
    .select()
    .from(Drawing)
    .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)));

  if (!drawing) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: `Drawing with id ${id} not found.`,
    });
  }

  const content = await c.locals.runtime.env.R2_BUCKET.get(id);
  if (!content) {
    throw new ActionError({
      code: "NOT_FOUND",
      message: `Content for drawing with id ${id} not found.`,
    });
  }

  const thumbnail = await c.locals.runtime.env.R2_BUCKET.get(`${id}-thumbnail`);

  const [newDrawing] = await db
    .insert(Drawing)
    .values({
      name: `${drawing.name} (copy)`,
      userId,
      parentFolderId: drawing.parentFolderId,
      fileSize: drawing.fileSize,
    })
    .returning();

  await Promise.all([
    c.locals.runtime.env.R2_BUCKET.put(
      newDrawing.id,
      await content.arrayBuffer(),
    ),
    thumbnail &&
      c.locals.runtime.env.R2_BUCKET.put(
        `${newDrawing.id}-thumbnail`,
        await thumbnail.arrayBuffer(),
      ),
  ]);

  return newDrawing;
};
