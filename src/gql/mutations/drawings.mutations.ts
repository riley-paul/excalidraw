import { builder } from "../gql-builder";
import * as tables from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { createDb } from "@/db";

const CreateDrawingInput = builder.inputType("CreateDrawingInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    parentFolderId: t.string({ required: false }),
  }),
});

const UpdateDrawingInput = builder.inputType("UpdateDrawingInput", {
  fields: (t) => ({
    name: t.string({ required: false }),
    parentFolderId: t.string({ required: false }),
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
          parentFolderId: input.parentFolderId ?? undefined,
        })
        .where(
          and(
            eq(tables.Drawing.id, drawingId),
            eq(tables.Drawing.userId, ctx.userId),
          ),
        )
        .returning();

      if (!updated) throw new Error("Drawing not found");

      return db.query.Drawing.findFirst(
        query({ where: { id: { eq: updated.id } } }),
      );
    },
  }),

  deleteDrawing: t.drizzleField({
    type: "Drawing",
    nullable: false,
    args: { drawingId: t.arg.id() },
    resolve: async (query, _root, { drawingId }, ctx) => {
      const db = createDb(ctx.env);
      const drawing = await db.query.Drawing.findFirst(
        query({
          where: {
            AND: [{ id: { eq: drawingId } }, { userId: { eq: ctx.userId } }],
          },
        }),
      );
      if (!drawing) throw new Error("Drawing not found");

      await db.delete(tables.Drawing).where(eq(tables.Drawing.id, drawingId));

      return drawing;
    },
  }),
}));
