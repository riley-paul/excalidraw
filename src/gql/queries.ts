import { createDb } from "@/db";
import { builder } from "./gql-builder";

builder.queryFields((t) => ({
  me: t.drizzleField({
    type: "User",
    resolve: async (query, _root, _args, ctx) => {
      const db = createDb(ctx.env);
      const user = await db.query.User.findFirst(
        query({ where: { id: { eq: ctx.userId } } }),
      );
      if (!user) throw new Error("User not found");
      return user;
    },
  }),
}));
