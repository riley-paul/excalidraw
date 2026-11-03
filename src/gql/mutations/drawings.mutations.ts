import { builder, type BuilderContext } from "../gql-builder";
import { ActionError } from "../action-error";
import * as tables from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { createDb } from "@/db";

export const exceedsStorageLimit = async (
  ctx: BuilderContext,
  newDrawing: { id: string; fileSize: number | null },
) => {
  const db = createDb(ctx.env);
  const drawingSizes = await db
    .select({ id: tables.Drawing.id, fileSize: tables.Drawing.fileSize })
    .from(tables.Drawing)
    .where(eq(tables.Drawing.userId, ctx.userId));

  const drawingSizeMap: Record<string, number> = {};
  drawingSizes.forEach((drawing) => {
    drawingSizeMap[drawing.id] = drawing.fileSize ?? 0;
  });
  drawingSizeMap[newDrawing.id] = newDrawing.fileSize ?? 0;

  const totalStorageUsed = Object.values(drawingSizeMap).reduce(
    (acc, size) => acc + size,
    0,
  );

  const [{ storageLimit }] = await db
    .select({ storageLimit: tables.User.storageLimit })
    .from(tables.User)
    .where(eq(tables.User.id, ctx.userId));

  return totalStorageUsed > storageLimit;
};

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

const SaveDrawingInput = builder.inputType("SaveDrawingInput", {
  fields: (t) => ({
    content: t.string({ required: true }),
    thumbnail: t.string({ required: true }),
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

  // export const save: ActionHandler<
  //   typeof drawingInputs.save,
  //   DrawingSelect
  // > = async ({ id, content, thumbnail }, c) => {
  //   const db = createDb(c.locals.env);
  //   const userId = isAuthorized(c).id;
  //   const bucket = c.locals.env.R2_BUCKET;
  //
  //   const [drawing] = await db
  //     .select()
  //     .from(Drawing)
  //     .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)));
  //
  //   if (!drawing) {
  //     throw new ActionError({
  //       code: "NOT_FOUND",
  //       message: `Drawing with id ${id} not found.`,
  //     });
  //   }
  //
  //   const storageExceeded = await exceedsStorageLimit(c, {
  //     id,
  //     fileSize: content.size,
  //   });
  //
  //   if (storageExceeded) {
  //     throw new ActionError({
  //       code: "CONTENT_TOO_LARGE",
  //       message: "Saving this drawing would exceed your storage limit.",
  //     });
  //   }
  //
  //   await Promise.all([
  //     bucket.put(id, content),
  //     bucket.put(`${id}-thumbnail`, thumbnail),
  //   ]);
  //
  //   const [updated] = await db
  //     .update(Drawing)
  //     .set({ savedAt: new Date().toISOString(), fileSize: content.size })
  //     .where(and(eq(Drawing.userId, userId), eq(Drawing.id, id)))
  //     .returning();
  //
  //   return updated;
  // };

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
