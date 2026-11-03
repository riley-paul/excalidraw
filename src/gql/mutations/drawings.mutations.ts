import { builder } from "../gql-builder";
import { ActionError } from "../action-error";
import * as tables from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { createDb } from "@/db";
import { exceedsStorageLimit } from "@/lib/utils";

const CreateDrawingInput = builder.inputType("CreateDrawingInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    parentFolderId: t.id({ required: false }),
  }),
});

const UpdateDrawingInput = builder.inputType("UpdateDrawingInput", {
  fields: (t) => ({
    name: t.string({ required: false }),
    parentFolderId: t.id({ required: false }),
  }),
});

builder.mutationFields((t) => ({
  createDrawing: t.drizzleField({
    type: "Drawing",
    nullable: true,
    args: { input: t.arg({ type: CreateDrawingInput }) },
    resolve: async (query, _root, { input }, ctx) => {
      const db = createDb(ctx.env);
      const [newDrawing] = await db
        .insert(tables.Drawing)
        .values({
          name: input.name,
          parentFolderId: input.parentFolderId || null,
          userId: ctx.userId,
        })
        .returning();

      return db.query.Drawing.findFirst(
        query({ where: { id: { eq: newDrawing.id } } }),
      );
    },
  }),

  updateDrawing: t.drizzleField({
    type: "Drawing",
    nullable: true,
    args: { drawingId: t.arg.id(), input: t.arg({ type: UpdateDrawingInput }) },
    resolve: async (query, _root, { drawingId, input }, ctx) => {
      const db = createDb(ctx.env);

      const [updated] = await db
        .update(tables.Drawing)
        .set({
          name: input.name ?? undefined,
          parentFolderId: input.parentFolderId,
        })
        .where(
          and(
            eq(tables.Drawing.id, drawingId),
            eq(tables.Drawing.userId, ctx.userId),
          ),
        )
        .returning();

      if (!updated)
        throw new ActionError({
          code: "NOT_FOUND",
          message: `Drawing with id ${drawingId} not found.`,
        });

      return db.query.Drawing.findFirst(
        query({ where: { id: { eq: updated.id } } }),
      );
    },
  }),

  duplicateDrawing: t.drizzleField({
    type: "Drawing",
    nullable: true,
    args: { drawingId: t.arg.id() },
    resolve: async (query, _root, { drawingId }, ctx) => {
      const db = createDb(ctx.env);
      const bucket = ctx.env.R2_BUCKET;

      const [drawing] = await db
        .select()
        .from(tables.Drawing)
        .where(
          and(
            eq(tables.Drawing.userId, ctx.userId),
            eq(tables.Drawing.id, drawingId),
          ),
        );

      if (!drawing) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: `Drawing with id ${drawingId} not found.`,
        });
      }

      const content = await bucket.get(drawingId);
      if (!content) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: `Content for drawing with id ${drawingId} not found.`,
        });
      }

      const newDrawingId = crypto.randomUUID();

      const storageExceeded = await exceedsStorageLimit(ctx, {
        id: newDrawingId,
        fileSize: content.size,
      });

      if (storageExceeded) {
        throw new ActionError({
          code: "CONTENT_TOO_LARGE",
          message: "Duplicating this drawing would exceed your storage limit.",
        });
      }

      const thumbnail = await bucket.get(`${drawingId}-thumbnail`);

      const insertDrawingPromise = db
        .insert(tables.Drawing)
        .values({
          id: newDrawingId,
          name: `${drawing.name} (copy)`,
          userId: ctx.userId,
          parentFolderId: drawing.parentFolderId,
          fileSize: drawing.fileSize,
        })
        .returning();
      const uploadContentPromise = bucket.put(
        newDrawingId,
        await content.arrayBuffer(),
      );
      const uploadThumbnailPromise = thumbnail
        ? bucket.put(`${newDrawingId}-thumbnail`, await thumbnail.arrayBuffer())
        : Promise.resolve();

      const [[newDrawing]] = await Promise.all([
        insertDrawingPromise,
        uploadContentPromise,
        uploadThumbnailPromise,
      ]);

      return db.query.Drawing.findFirst(
        query({ where: { id: { eq: newDrawing.id } } }),
      );
    },
  }),

  deleteDrawing: t.drizzleField({
    type: "Drawing",
    nullable: false,
    args: { drawingId: t.arg.id() },
    resolve: async (query, _root, { drawingId }, ctx) => {
      const db = createDb(ctx.env);
      const bucket = ctx.env.R2_BUCKET;

      const drawing = await db.query.Drawing.findFirst(
        query({
          where: {
            AND: [{ id: { eq: drawingId } }, { userId: { eq: ctx.userId } }],
          },
        }),
      );
      if (!drawing)
        throw new ActionError({
          code: "NOT_FOUND",
          message: `Drawing with id ${drawingId} not found.`,
        });

      await db.delete(tables.Drawing).where(eq(tables.Drawing.id, drawingId));
      await bucket.delete(drawingId);
      await bucket.delete(`${drawingId}-thumbnail`);

      return drawing;
    },
  }),
}));
