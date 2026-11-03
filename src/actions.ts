import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { createDb } from "./db";
import * as tables from "./db/schema";
import { and, eq } from "drizzle-orm";
import { exceedsStorageLimit } from "./lib/utils";

const saveDrawing = defineAction({
  input: z.object({
    drawingId: z.string(),
    content: z.file(),
    thumbnail: z.file(),
  }),
  accept: "form",
  handler: async ({ drawingId, content, thumbnail }, c) => {
    const db = createDb(c.locals.env);
    const user = c.locals.user;
    if (!user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "User is not authorized.",
      });
    }
    const userId = user.id;
    const bucket = c.locals.env.R2_BUCKET;

    const [drawing] = await db
      .select()
      .from(tables.Drawing)
      .where(
        and(
          eq(tables.Drawing.userId, userId),
          eq(tables.Drawing.id, drawingId),
        ),
      );

    if (!drawing) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: `Drawing with id ${drawingId} not found.`,
      });
    }

    const storageExceeded = await exceedsStorageLimit(
      { env: c.locals.env, userId },
      { id: drawingId, fileSize: content.size },
    );

    if (storageExceeded) {
      throw new ActionError({
        code: "CONTENT_TOO_LARGE",
        message: "Saving this drawing would exceed your storage limit.",
      });
    }

    await Promise.all([
      bucket.put(drawingId, content),
      bucket.put(`${drawingId}-thumbnail`, thumbnail),
    ]);

    const [updated] = await db
      .update(tables.Drawing)
      .set({ savedAt: new Date().toISOString(), fileSize: content.size })
      .where(
        and(
          eq(tables.Drawing.userId, userId),
          eq(tables.Drawing.id, drawingId),
        ),
      )
      .returning();

    return updated;
  },
});

export const server = { saveDrawing };
