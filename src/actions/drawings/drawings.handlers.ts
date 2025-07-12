import { ActionError, type ActionHandler } from "astro:actions";
import type drawingInputs from "./drawings.inputs";
import type { DrawingSelect, DrawingSelectWithContent } from "@/lib/types";
import { createDb } from "@/db";
import { isAuthorized } from "../helpers";
import { Drawing } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

const get: ActionHandler<
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

const list: ActionHandler<typeof drawingInputs.list, DrawingSelect[]> = async (
  _,
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const drawings = await db
    .select()
    .from(Drawing)
    .where(eq(Drawing.userId, userId))
    .orderBy(desc(Drawing.createdAt));

  return drawings;
};

const create: ActionHandler<
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

const update: ActionHandler<
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

const remove: ActionHandler<typeof drawingInputs.remove, boolean> = async (
  { id },
  c,
) => {
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

const save: ActionHandler<typeof drawingInputs.save, DrawingSelect> = async (
  { id, content, thumbnail },
  c,
) => {
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

const drawingHandlers = {
  get,
  list,
  create,
  update,
  remove,
  save,
};
export default drawingHandlers;
