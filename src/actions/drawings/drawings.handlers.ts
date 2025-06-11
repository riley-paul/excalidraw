import { ActionError, type ActionHandler } from "astro:actions";
import type drawingInputs from "./drawings.inputs";
import type { DrawingSelect, MinimalDrawingSelect } from "@/lib/types";
import { createDb } from "@/db";
import { isAuthorized } from "../helpers";
import { Drawing } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

const get: ActionHandler<typeof drawingInputs.get, DrawingSelect> = async (
  { id },
  c
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

  return drawing;
};

const list: ActionHandler<
  typeof drawingInputs.list,
  MinimalDrawingSelect[]
> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const drawings = await db
    .select({
      id: Drawing.id,
      title: Drawing.title,
      description: Drawing.description,
      userId: Drawing.userId,
      updatedAt: Drawing.updatedAt,
      createdAt: Drawing.createdAt,
    })
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
  c
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

  return true;
};

const drawingHandlers = {
  get,
  list,
  create,
  update,
  remove,
};
export default drawingHandlers;
