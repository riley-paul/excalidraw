import { createDb } from "@/db";
import { builder } from "./gql-builder";
import * as table from "@/db/schema";
import { eq, sum } from "drizzle-orm";

builder.drizzleObject("User", {
  name: "UserObjectType",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    avatarUrl: t.exposeString("avatarUrl", { nullable: true }),
    storageLimit: t.exposeInt("storageLimit"),
    storageUsed: t.field({
      type: "Int",
      resolve: async (user, _, ctx) => {
        const db = createDb(ctx.env);
        const [{ storageUsed }] = await db
          .select({ storageUsed: sum(table.Drawing.fileSize) })
          .from(table.Drawing)
          .where(eq(table.Drawing.userId, user.id));
        return Number(storageUsed);
      },
    }),
  }),
});

builder.drizzleObject("Drawing", {
  name: "DrawingObjectType",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    parentFolderId: t.exposeID("parentFolderId", { nullable: true }),
    fileSize: t.exposeInt("fileSize", { nullable: true }),
    savedAt: t.exposeString("savedAt", { nullable: true }),
    updatedAt: t.exposeString("updatedAt"),
    content: t.field({
      type: "String",
      nullable: true,
      resolve: async (drawing, _, ctx) => {
        const bucket = ctx.env.R2_BUCKET;
        const content = await bucket.get(drawing.id);
        return content ? await content.text() : null;
      },
    }),
  }),
});

builder.drizzleObject("Folder", {
  name: "FolderObjectType",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    parentFolderId: t.exposeID("parentFolderId", { nullable: true }),
  }),
});
