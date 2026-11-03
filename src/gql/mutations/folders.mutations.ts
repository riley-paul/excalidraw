import { builder } from "../gql-builder";
import * as tables from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { createDb } from "@/db";

const CreateFolderInput = builder.inputType("CreateFolderInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    parentFolderId: t.id({ required: false }),
  }),
});

const UpdateFolderInput = builder.inputType("UpdateFolderInput", {
  fields: (t) => ({
    name: t.string({ required: false }),
    parentFolderId: t.id({ required: false }),
  }),
});

builder.mutationFields((t) => ({
  createFolder: t.drizzleField({
    type: "Folder",
    nullable: true,
    args: { input: t.arg({ type: CreateFolderInput, required: true }) },
    resolve: async (query, _root, args, ctx) => {
      const db = createDb(ctx.env);
      const [newFolder] = await db
        .insert(tables.Folder)
        .values({
          name: args.input.name,
          parentFolderId: args.input.parentFolderId,
          userId: ctx.userId,
        })
        .returning();

      return db.query.Folder.findFirst(
        query({ where: { id: { eq: newFolder.id } } }),
      );
    },
  }),

  updateFolder: t.drizzleField({
    type: "Folder",
    nullable: true,
    args: {
      folderId: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateFolderInput, required: true }),
    },
    resolve: async (query, _root, { folderId, input }, ctx) => {
      const db = createDb(ctx.env);
      const [updated] = await db
        .update(tables.Folder)
        .set({
          name: input.name ?? undefined,
          parentFolderId: input.parentFolderId ?? undefined,
        })
        .where(
          and(
            eq(tables.Folder.id, folderId),
            eq(tables.Folder.userId, ctx.userId),
          ),
        )
        .returning();

      return db.query.Folder.findFirst(
        query({ where: { id: { eq: updated.id } } }),
      );
    },
  }),

  deleteFolder: t.drizzleField({
    type: "Folder",
    nullable: true,
    args: { folderId: t.arg.id({ required: true }) },
    resolve: async (query, _root, { folderId }, ctx) => {
      const db = createDb(ctx.env);

      const folder = await db.query.Folder.findFirst(
        query({
          where: {
            AND: [{ id: { eq: folderId } }, { userId: { eq: ctx.userId } }],
          },
        }),
      );

      if (!folder) throw new Error("Folder not found");

      await db.delete(tables.Folder).where(eq(tables.Folder.id, folderId));
      return folder;
    },
  }),
}));
