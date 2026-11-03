import { builder } from "../gql-builder";
import * as tables from "@/db/schema";
import { eq } from "drizzle-orm";
import { createDb } from "@/db";

builder.mutationFields((t) => ({
  deleteUser: t.boolean({
    resolve: async (_root, _args, ctx) => {
      const db = createDb(ctx.env);
      await db.delete(tables.User).where(eq(tables.User.id, ctx.userId));
      return true;
    },
  }),
}));
