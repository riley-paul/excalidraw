import { ActionError, defineAction } from "astro:actions";
import {
  defaultDrawingSort,
  type DrawingSelect,
  type DrawingSelectWithContent,
  type DrawingsSortField,
  type DrawingsSort,
  zDrawingsQueryParams,
} from "@/lib/types";
import { createDb } from "@/db";
import { isAuthorized } from "./helpers";
import { Drawing } from "@/db/schema";
import { and, asc, desc, eq, like, or } from "drizzle-orm";
import { z } from "astro/zod";
import { env } from "cloudflare:workers";

export const get = defineAction({
  input: z.object({
    id: z.uuid(),
    withContent: z.boolean().default(false),
  }),
  handler: async (
    { id, withContent },
    c,
  ): Promise<DrawingSelectWithContent | null> => {
    const db = createDb(env);
    const userId = isAuthorized(c).id;
    const bucket = env.R2_BUCKET;

    const [drawing] = await db
      .select()
      .from(Drawing)
      .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)));

    if (!drawing) {
      return null;
    }

    if (!withContent) {
      return { ...drawing, content: null };
    }

    const content = await bucket.get(id);
    return { ...drawing, content: content ? await content.text() : null };
  },
});

const LIST_SORT_MAPPING: Record<DrawingsSortField, any> = {
  name: Drawing.name,
  updatedAt: Drawing.savedAt,
  createdAt: Drawing.createdAt,
  fileSize: Drawing.fileSize,
};

const getOrderBy = (sort: DrawingsSort = defaultDrawingSort) => {
  const sortField = LIST_SORT_MAPPING[sort.field];
  return sort.direction === "asc" ? asc(sortField) : desc(sortField);
};

const getSearch = (search: string | undefined) => {
  if (!search) return undefined;
  const searchTerm = `%${search}%`;
  return or(like(Drawing.name, searchTerm));
};

export const list = defineAction({
  input: zDrawingsQueryParams,
  handler: async ({ sort, search }, c): Promise<DrawingSelect[]> => {
    const db = createDb(env);
    const userId = isAuthorized(c).id;

    const drawings = await db
      .select()
      .from(Drawing)
      .where(and(eq(Drawing.userId, userId), getSearch(search)))
      .orderBy(getOrderBy(sort));

    return drawings;
  },
});

export const create = defineAction({
  input: z.object({
    name: z.string().min(1).max(100),
    parentFolderId: z.uuid().nullish(),
  }),
  handler: async (data, c) => {
    const db = createDb(env);
    const userId = isAuthorized(c).id;

    const [newDrawing] = await db
      .insert(Drawing)
      .values({ ...data, userId })
      .returning();
    return newDrawing;
  },
});

export const update = defineAction({
  input: z.object({
    id: z.uuid(),
    name: z.string().min(1).max(100).optional(),
    parentFolderId: z.uuid().nullish(),
  }),
  handler: async ({ id, ...updateData }, c) => {
    const db = createDb(env);
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
  },
});

export const remove = defineAction({
  input: z.object({ id: z.uuid() }),
  handler: async ({ id }, c) => {
    const db = createDb(env);
    const userId = isAuthorized(c).id;
    const bucket = env.R2_BUCKET;

    const result = await db
      .delete(Drawing)
      .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)));

    if (result.rowsAffected === 0) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: `Drawing with id ${id} not found.`,
      });
    }

    await bucket.delete(id);
    await bucket.delete(`${id}-thumbnail`);

    return true;
  },
});

export const save = defineAction({
  input: z.object({
    id: z.uuid(),
    content: z.instanceof(File),
    thumbnail: z.instanceof(File),
  }),
  handler: async ({ id, content, thumbnail }, c) => {
    const db = createDb(env);
    const userId = isAuthorized(c).id;
    const bucket = env.R2_BUCKET;

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
      bucket.put(id, content),
      bucket.put(`${id}-thumbnail`, thumbnail),
    ]);

    const [updated] = await db
      .update(Drawing)
      .set({ savedAt: new Date().toISOString(), fileSize: content.size })
      .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)))
      .returning();

    return updated;
  },
});

export const duplicate = defineAction({
  input: z.object({ id: z.uuid() }),
  handler: async ({ id }, c) => {
    const db = createDb(env);
    const userId = isAuthorized(c).id;
    const bucket = env.R2_BUCKET;

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

    const content = await bucket.get(id);
    if (!content) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: `Content for drawing with id ${id} not found.`,
      });
    }

    const thumbnail = await bucket.get(`${id}-thumbnail`);

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
      bucket.put(newDrawing.id, await content.arrayBuffer()),
      thumbnail &&
        bucket.put(`${newDrawing.id}-thumbnail`, await thumbnail.arrayBuffer()),
    ]);

    return newDrawing;
  },
});
